import { describe, it, strict } from 'poku';
import { readNugetConfig } from '../../../src/hooks/dependency/dotnet/config.js';
import { readNugetLock } from '../../../src/hooks/dependency/dotnet/lockfile.js';
import {
  readMsbuildImport,
  readProjectFile,
} from '../../../src/hooks/dependency/dotnet/project.js';
import { CANNOT_JUDGE, CLEAN, findings, PLAIN, reported } from './__utils__.js';

const project = (body: string): string =>
  `<Project Sdk="Microsoft.NET.Sdk">\n${body}\n</Project>\n`;

describe('a nuget.config flags every package source it lists over plain http://', () => {
  it('reads each source of every packageSources section, whatever the case of its elements', () => {
    const result = readNugetConfig(
      'NuGet.Config',
      `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <clear />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" protocolVersion="3" />
    <add key="internal" value="http://feed.internal/v3/index.json" allowInsecureConnections="true" />
    <add key="local" value="../packages" />
  </packageSources>
  <PackageSources>
    <Add key="legacy" value="http://legacy.internal/nuget" />
  </PackageSources>
  <config>
    <add key="defaultPushSource" value="http://push.internal/" />
  </config>
</configuration>
`
    );

    strict.deepStrictEqual(
      reported(result),
      findings([
        `${PLAIN}: http://feed.internal/v3/index.json, http://legacy.internal/nuget`,
      ])
    );
  });
});

describe('a nuget.config leaves out a source it switches off', () => {
  it('reads every add, remove, and clear in order, and the sources disabledPackageSources turns off, whatever the case of their keys', () => {
    const result = readNugetConfig(
      'nuget.config',
      `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="Legacy-TFS" value="http://tfs.internal:8080/nuget/v3/index.json" />
    <add key="removed" value="http://removed.internal/nuget" />
    <remove key="removed" />
    <add key="live" value="http://live.internal/nuget" />
    <add key="Reenabled" value="http://reenabled.internal/nuget" />
  </packageSources>
  <disabledPackageSources>
    <add key="reenabled" value="true" />
    <clear />
    <add key="legacy-tfs" value="true" />
    <add key="live" value="false" />
  </disabledPackageSources>
</configuration>
`
    );

    strict.deepStrictEqual(
      reported(result),
      findings([
        `${PLAIN}: http://live.internal/nuget, http://reenabled.internal/nuget`,
      ])
    );
  });
});

describe('an MSBuild file flags the package sources its properties add to a restore', () => {
  it('splits every restore source property on semicolons, whatever the case of its name', () => {
    const result = readMsbuildImport(
      'Directory.Build.props',
      project(`  <PropertyGroup>
    <RestoreSources>$(RestoreSources);http://feed.internal/v3/index.json;https://api.nuget.org/v3/index.json</RestoreSources>
    <restoreadditionalprojectsources>
      http://extra.internal/nuget ;
      ../local-feed
    </restoreadditionalprojectsources>
    <PackageProjectUrl>http://example.com/project</PackageProjectUrl>
  </PropertyGroup>`)
    );

    strict.deepStrictEqual(
      reported(result),
      findings([
        `${PLAIN}: http://extra.internal/nuget, http://feed.internal/v3/index.json`,
      ])
    );
  });

  it('declares dependencies only in a project file that references a package', () => {
    const results = [
      readProjectFile(
        'Api.csproj',
        project(
          '  <ItemGroup>\n    <PackageReference Include="Serilog" Version="3.1.1" />\n  </ItemGroup>'
        )
      ),
      readProjectFile(
        'Api.fsproj',
        project(
          '  <ItemGroup>\n    <packagereference Include="FSharp.Core" />\n  </ItemGroup>'
        )
      ),
      readProjectFile(
        'Api.vbproj',
        project(
          '  <ItemGroup>\n    <ProjectReference Include="../Lib/Lib.vbproj" />\n    <PackageReference Update="Serilog" Version="3.1.1" />\n  </ItemGroup>'
        )
      ),
      readMsbuildImport(
        'Directory.Build.props',
        project(
          '  <ItemGroup>\n    <PackageReference Include="StyleCop.Analyzers" />\n  </ItemGroup>'
        )
      ),
    ].map(({ needsLockfile }) => needsLockfile);

    strict.deepStrictEqual(results, [true, true, false, false]);
  });
});

describe('a packages.lock.json flags nothing on its own', () => {
  it('reads a lockfile with its target frameworks, and a blank one NuGet takes as opting in', () => {
    const results = [
      readNugetLock(
        'packages.lock.json',
        JSON.stringify({
          version: 1,
          dependencies: {
            'net8.0': {
              Serilog: {
                type: 'Direct',
                requested: '[3.1.1, )',
                resolved: '3.1.1',
                contentHash: 'abc==',
              },
            },
          },
        })
      ),
      readNugetLock('packages.Api.lock.json', '\n'),
    ].map(reported);

    strict.deepStrictEqual(results, [CLEAN, CLEAN]);
  });
});

describe('a .NET dependency file the checker cannot judge is refused instead of read as clean', () => {
  const cases: Array<[string, () => unknown]> = [
    [
      'a nuget.config that is not well-formed XML',
      () =>
        readNugetConfig(
          'nuget.config',
          '<configuration><packageSources></configuration>'
        ),
    ],
    [
      'a nuget.config whose root is not configuration',
      () => readNugetConfig('nuget.config', '<settings />'),
    ],
    ['an empty nuget.config', () => readNugetConfig('nuget.config', '')],
    [
      'a project file whose root is not Project',
      () => readProjectFile('Api.csproj', '<project />'),
    ],
    [
      'a packages.lock.json that is not JSON',
      () => readNugetLock('packages.lock.json', '{"version": 1,'),
    ],
    [
      'a JSON file that is not a NuGet lockfile',
      () => readNugetLock('packages.lock.json', '{"version": 1}'),
    ],
    [
      'a packages.lock.json whose frameworks are a list',
      () =>
        readNugetLock(
          'packages.lock.json',
          '{"version": 1, "dependencies": {"net8.0": []}}'
        ),
    ],
  ];

  for (const [description, read] of cases)
    it(`refuses ${description}`, () => {
      strict.throws(read, CANNOT_JUDGE);
    });
});
