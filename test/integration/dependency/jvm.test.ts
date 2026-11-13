import { describe, it, strict } from 'poku';
import {
  readGradleLockfile,
  readGradleScript,
} from '../../../src/hooks/dependency/jvm/gradle.js';
import {
  readMavenSettings,
  readPom,
} from '../../../src/hooks/dependency/jvm/maven.js';
import { readWrapperProperties } from '../../../src/hooks/dependency/jvm/wrapper.js';
import {
  CANNOT_JUDGE,
  CLEAN,
  findings,
  flaggedNames,
  PLAIN,
  reported,
} from './__utils__.js';

describe('a pom.xml flags every repository it fetches dependencies or plugins from over plain http:// or git://', () => {
  it('reads the repositories of the project and its profiles, never the one it deploys to or a URL that names no repository', () => {
    const result = readPom(
      'pom.xml',
      `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <url>http://example.com/project</url>
  <licenses>
    <license><url>http://www.apache.org/licenses/LICENSE-2.0.txt</url></license>
  </licenses>
  <repositories>
    <repository><id>central</id><url>https://repo.maven.apache.org/maven2</url></repository>
    <repository><id>internal</id><url>http://maven.internal/releases</url></repository>
  </repositories>
  <pluginRepositories>
    <pluginRepository><id>plugins</id><url>git://plugins.internal/repo</url></pluginRepository>
  </pluginRepositories>
  <distributionManagement>
    <repository><id>deploy</id><url>http://deploy.internal/releases</url></repository>
  </distributionManagement>
  <profiles>
    <profile>
      <repositories>
        <repository><id>nightly</id><url>http://nightly.internal/snapshots</url></repository>
      </repositories>
    </profile>
  </profiles>
</project>
`
    );

    strict.deepStrictEqual(
      [reported(result), result.needsLockfile],
      [
        findings([
          `${PLAIN}: git://plugins.internal/repo, http://maven.internal/releases, http://nightly.internal/snapshots`,
        ]),
        false,
      ]
    );
  });
});

describe('a Maven settings.xml flags every mirror and repository it reaches over plain http://', () => {
  it('reads its mirrors and the repositories its profiles add', () => {
    const result = readMavenSettings(
      'settings.xml',
      `<settings>
  <mirrors>
    <mirror><id>all</id><mirrorOf>*</mirrorOf><url>http://nexus.internal/all</url></mirror>
  </mirrors>
  <profiles>
    <profile>
      <repositories>
        <repository><id>internal</id><url>https://nexus.internal/releases</url></repository>
      </repositories>
      <pluginRepositories>
        <pluginRepository><id>plugins</id><url>http://nexus.internal/plugins</url></pluginRepository>
      </pluginRepositories>
    </profile>
  </profiles>
</settings>
`
    );

    strict.deepStrictEqual(
      reported(result),
      findings([
        `${PLAIN}: http://nexus.internal/all, http://nexus.internal/plugins`,
      ])
    );
  });

  it('flags nothing in a settings.xml another tool writes', () => {
    const result = readMavenSettings(
      'settings.xml',
      '<preferences><mirrors><mirror><url>http://elsewhere.example</url></mirror></mirrors></preferences>'
    );

    strict.deepStrictEqual(reported(result), CLEAN);
  });
});

describe('a wrapper flags the build tool it downloads over plain http://', () => {
  const written: Array<[string, string, string[]]> = [
    [
      'with the colon escaped, as Gradle writes it',
      'distributionBase=GRADLE_USER_HOME\ndistributionUrl=http\\://services.gradle.org/distributions/gradle-8.5-bin.zip\n',
      ['http://services.gradle.org/distributions/gradle-8.5-bin.zip'],
    ],
    [
      'with a unicode escape and a colon before its value',
      'wrapperUrl : \\u0068ttp://repo.internal/maven-wrapper.jar\n',
      ['http://repo.internal/maven-wrapper.jar'],
    ],
    [
      'across a continued line',
      'distributionUrl = http://repo.internal/maven/\\\n    apache-maven-3.9.6-bin.zip\n',
      ['http://repo.internal/maven/apache-maven-3.9.6-bin.zip'],
    ],
    [
      'only in its last assignment',
      'distributionUrl=http://old.internal/gradle.zip\ndistributionUrl=https://services.gradle.org/distributions/gradle-8.5-bin.zip\n',
      [],
    ],
    [
      'never in a comment',
      '# distributionUrl=http://old.internal/gradle.zip\n! wrapperUrl=http://old.internal/wrapper.jar\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.5-bin.zip\n',
      [],
    ],
  ];

  for (const [form, content, urls] of written)
    it(`reads a URL ${form}`, () => {
      strict.deepStrictEqual(
        flaggedNames(
          readWrapperProperties('gradle-wrapper.properties', content)
        ),
        urls
      );
    });
});

describe('a Gradle script flags every URL it writes as a string in a block that names repositories', () => {
  it('reads Groovy repositories, Ivy repositories, and source control, never the repositories a publication deploys to', () => {
    const result = readGradleScript(
      'build.gradle',
      `plugins {
  id 'java-library'
  id 'maven-publish'
}

// maven { url 'http://commented.example' }
/* repositories { maven { url "http://block.example" } } */

def homepage = 'http://example.com/project'

repositories {
  mavenCentral()
  maven { url 'http://maven.internal/releases'; allowInsecureProtocol = true }
  maven {
    url "http://\${nexusHost}/snapshots"
    credentials { username = 'ci' }
  }
  ivy { url uri('git://ivy.internal/repo') }
  maven { url '''http://triple.internal/repo''' }
}

publishing {
  publications {
    maven(MavenPublication) {
      pom { licenses { license { url = 'http://www.apache.org/licenses/LICENSE-2.0.txt' } } }
    }
  }
  repositories {
    maven { url 'http://deploy.internal/releases' }
  }
}
`
    );

    strict.deepStrictEqual(
      reported(result),
      findings([
        `${PLAIN}: git://ivy.internal/repo, http://\${nexusHost}/snapshots, http://maven.internal/releases, http://triple.internal/repo`,
      ])
    );
  });

  it('reads Kotlin repositories, raw strings, and nested comments, and the repositories of the settings script', () => {
    const kotlin = readGradleScript(
      'build.gradle.kts',
      `/* outer /* nested "http://nested.example" */ still a comment */
repositories {
    maven("http://shorthand.internal/repo")
    maven { url = uri("""http://raw.internal/repo\\""") }
    maven(url = "https://safe.example/repo")
}

val separator = '"'
`
    );
    const settings = readGradleScript(
      'settings.gradle.kts',
      `pluginManagement {
    repositories {
        gradlePluginPortal()
        maven("http://plugins.internal/repo")
    }
}

dependencyResolutionManagement {
    repositories { maven { url = uri("http://dependencies.internal/repo") } }
}
`
    );

    strict.deepStrictEqual(
      [flaggedNames(kotlin), flaggedNames(settings)],
      [
        ['http://shorthand.internal/repo', 'http://raw.internal/repo\\'],
        ['http://plugins.internal/repo', 'http://dependencies.internal/repo'],
      ]
    );
  });

  const declared: Array<[string, string, string, boolean]> = [
    [
      'a build script with a dependency',
      'build.gradle',
      "dependencies {\n  implementation 'com.google.guava:guava:33.0.0-jre'\n}\n",
      true,
    ],
    [
      'a Kotlin Multiplatform source set',
      'build.gradle.kts',
      'kotlin {\n    sourceSets {\n        commonMain {\n            dependencies { implementation(libs.ktor.client) }\n        }\n    }\n}\n',
      true,
    ],
    [
      'an empty dependencies block',
      'build.gradle.kts',
      'dependencies {\n    // none yet\n}\n',
      false,
    ],
    [
      'the classpath of the build script itself',
      'build.gradle',
      "buildscript {\n  dependencies { classpath 'com.android.tools.build:gradle:8.2.0' }\n}\n",
      false,
    ],
    [
      'the dependencies of the subprojects',
      'build.gradle',
      "subprojects {\n  dependencies { testImplementation 'junit:junit:4.13.2' }\n}\n",
      false,
    ],
    [
      'a script another one applies',
      'gradle/shared.gradle',
      "dependencies {\n  implementation 'com.google.guava:guava:33.0.0-jre'\n}\n",
      false,
    ],
  ];

  for (const [source, file, content, needsLockfile] of declared)
    it(`reads ${source} as ${needsLockfile ? 'declaring' : 'declaring no'} dependencies of the project`, () => {
      strict.strictEqual(
        readGradleScript(file, content).needsLockfile,
        needsLockfile
      );
    });
});

describe('a gradle.lockfile flags nothing on its own', () => {
  it('reads the modules it locks and the configurations that lock none', () => {
    const result = readGradleLockfile(
      'gradle.lockfile',
      `# This is a Gradle generated file for dependency locking.
# Manual edits can break the build and are not advised.
# This file is expected to be part of source control.
com.google.guava:guava:33.0.0-jre=compileClasspath, runtimeClasspath\r
org.slf4j:slf4j-api:2.0.9=runtimeClasspath
empty=annotationProcessor
`
    );

    strict.deepStrictEqual(reported(result), CLEAN);
  });
});

describe('a JVM dependency file the checker cannot judge stops it instead of reading as clean', () => {
  const cases: Array<[string, () => unknown]> = [
    [
      'a pom.xml that is not well-formed XML',
      () => readPom('pom.xml', '<project><repositories></project>'),
    ],
    [
      'a pom.xml whose root is not project',
      () => readPom('pom.xml', '<settings />'),
    ],
    [
      'a settings.xml that is not well-formed XML',
      () => readMavenSettings('settings.xml', '<settings><mirrors>'),
    ],
    [
      'a wrapper with a unicode escape short of four digits',
      () =>
        readWrapperProperties(
          'maven-wrapper.properties',
          'wrapperUrl=\\u68ttp://repo.internal/maven-wrapper.jar\n'
        ),
    ],
    [
      'a Groovy string that runs past the end of its line',
      () =>
        readGradleScript(
          'build.gradle',
          "repositories {\n  maven { url 'http://repo.internal }\n}\n"
        ),
    ],
    [
      'a Kotlin raw string that never closes',
      () =>
        readGradleScript(
          'build.gradle.kts',
          'repositories { maven("""http://repo.internal) }\n'
        ),
    ],
    [
      'a block comment that never closes',
      () =>
        readGradleScript(
          'build.gradle',
          "/* repositories {\nmaven { url 'http://repo.internal' } }\n"
        ),
    ],
    [
      'a Kotlin block comment whose nested comment leaves it open',
      () =>
        readGradleScript(
          'build.gradle.kts',
          '/* outer /* nested */\nrepositories { mavenCentral() }\n'
        ),
    ],
    [
      'a block it never closes',
      () =>
        readGradleScript('build.gradle', 'repositories {\n  mavenCentral()\n'),
    ],
    [
      'a block it closes without opening',
      () =>
        readGradleScript('settings.gradle', "rootProject.name = 'app'\n}\n"),
    ],
    [
      'a gradle.lockfile line that locks no version',
      () =>
        readGradleLockfile(
          'gradle.lockfile',
          'com.google.guava:guava=compileClasspath\n'
        ),
    ],
    [
      'a gradle.lockfile holding a merge conflict',
      () =>
        readGradleLockfile(
          'gradle.lockfile',
          '<<<<<<< HEAD\ncom.google.guava:guava:33.0.0-jre=compileClasspath\n'
        ),
    ],
  ];

  for (const [description, read] of cases)
    it(`refuses ${description}`, () => {
      strict.throws(read, CANNOT_JUDGE);
    });
});
