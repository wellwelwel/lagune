# OWASP 출처

> 내장 OWASP 전문 지식의 출처를 OWASP 공식 공격 페이지와 Cheat Sheet 페이지에 대응시켜 정리했습니다.

표준 URL: https://lagune.ai/ko-KR/docs/references/owasp-sources
언어: ko-KR
원문: https://lagune.ai/docs/references/owasp-sources
마지막 업데이트: 2026-11-04

이 문서는 OWASP의 모든 **공격**(`www-community`)과 **Cheat Sheet**(`CheatSheetSeries`) 항목을 보안 카테고리에 대응시키고, 각 항목을 공식 공개 페이지에 연결합니다. 한 카테고리 안에서 같은 위험을 다루는 공격과 Cheat Sheet는 체크리스트 한 줄에 쉼표로 구분해 함께 나열합니다. 직접 대응하는 짝이 없는 항목은 한 줄을 단독으로 차지합니다.

- 이 자료의 공로는 OWASP에 있습니다. 공격 페이지는 `https://owasp.org/www-community/attacks/<attack>` 주소에, Cheat Sheet는 `https://cheatsheetseries.owasp.org/cheatsheets/<cheat>.html` 주소에 있습니다.

---

## 1. 인젝션(일반)

- [x] [Code Injection](https://owasp.org/www-community/attacks/Code_Injection), [Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html), [Injection Prevention in Java](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_in_Java_Cheat_Sheet.html) (interpreter)
- [x] [Direct Dynamic Code Evaluation (Eval Injection)](https://owasp.org/www-community/attacks/Direct_Dynamic_Code_Evaluation_Eval_Injection) (interpreter)
- [x] [Function Injection](https://owasp.org/www-community/attacks/Function_Injection) (interpreter)
- [x] [Resource Injection](https://owasp.org/www-community/attacks/Resource_Injection) (network)
- [x] [Special Element Injection](https://owasp.org/www-community/attacks/Special_Element_Injection) (interpreter)
- [x] [Custom Special Character Injection](https://owasp.org/www-community/attacks/Custom_Special_Character_Injection) (interpreter)
- [x] [Comment Injection Attack](https://owasp.org/www-community/attacks/Comment_Injection_Attack) (interpreter)
- [x] [Parameter Delimiter](https://owasp.org/www-community/attacks/Parameter_Delimiter) (interpreter)
- [x] [Server-Side Includes (SSI) Injection](https://owasp.org/www-community/attacks/Server-Side_Includes_%28SSI%29_Injection) (interpreter)
- [x] [Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), [Bean Validation](https://cheatsheetseries.owasp.org/cheatsheets/Bean_Validation_Cheat_Sheet.html) (interpreter)

---

## 2. SQL / 데이터베이스 인젝션

- [x] [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection), [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html), [Query Parameterization](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html) (sql)
- [x] [Blind SQL Injection](https://owasp.org/www-community/attacks/Blind_SQL_Injection) (sql)
- [x] [SQL Injection Bypassing WAF](https://owasp.org/www-community/attacks/SQL_Injection_Bypassing_WAF) (sql)
- [x] [RSQL Injection](https://owasp.org/www-community/attacks/RSQL_Injection) (interpreter)
- [x] [Database Security](https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html) (sql)
- [x] [NoSQL Security](https://cheatsheetseries.owasp.org/cheatsheets/NoSQL_Security_Cheat_Sheet.html) (interpreter)

---

## 3. OS / 명령어 인젝션

- [x] [Command Injection](https://owasp.org/www-community/attacks/Command_Injection), [OS Command Injection Defense](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html) (interpreter)

---

## 4. LDAP / XPath / XML 인젝션

- [x] [LDAP Injection](https://owasp.org/www-community/attacks/LDAP_Injection), [LDAP Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html) (interpreter)
- [x] [XPATH Injection](https://owasp.org/www-community/attacks/XPATH_Injection) (interpreter)
- [x] [Blind XPath Injection](https://owasp.org/www-community/attacks/Blind_XPath_Injection) (interpreter)
- [x] [XML External Entity (XXE) Prevention](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html), [XML Security](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) (xml)

---

## 5. 크로스 사이트 스크립팅(XSS)

- [x] [Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/Cross-site-Scripting-%28XSS%29), [Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [XSS Filter Evasion](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html) (browser)
- [x] [DOM Based XSS](https://owasp.org/www-community/attacks/DOM_Based_XSS), [DOM based XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html), [DOM Clobbering Prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html) (browser)
- [x] [Reflected DOM Injection](https://owasp.org/www-community/attacks/Reflected_DOM_Injection) (browser)
- [x] [XSS in Converting File Content to Text](https://owasp.org/www-community/attacks/XSS_in_Converting_File_Content_to_Text) (browser)
- [x] [XSS in subtitle](https://owasp.org/www-community/attacks/Xss_in_subtitle) (browser)
- [x] [Cross Frame Scripting](https://owasp.org/www-community/attacks/Cross_Frame_Scripting) (browser)
- [x] [Cross Site Tracing](https://owasp.org/www-community/attacks/Cross_Site_Tracing) (browser)
- [x] [Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) (browser)

---

## 6. 크로스 사이트 요청 위조(CSRF)와 클릭재킹

- [x] [Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/cross-site-request-forgery), [XSRF](https://owasp.org/www-community/attacks/XSRF), [Cross-Site Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) (http-request)
- [x] [Clickjacking](https://owasp.org/www-community/attacks/Clickjacking), [Clickjacking Defense](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html) (browser)
- [x] [Cross Site History Manipulation (XSHM)](https://owasp.org/www-community/attacks/Cross_Site_History_Manipulation_%28XSHM%29) (browser)
- [x] [Form action hijacking](https://owasp.org/www-community/attacks/Form_action_hijacking) (network)
- [x] [Reverse Tabnabbing](https://owasp.org/www-community/attacks/Reverse_Tabnabbing) (browser)

---

## 7. 리다이렉트와 포워드

- [x] [Open Redirect](https://owasp.org/www-community/attacks/open_redirect), [Unvalidated Redirects and Forwards](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) (network)
- [x] [Execution After Redirect (EAR)](https://owasp.org/www-community/attacks/Execution_After_Redirect_%28EAR%29) (browser)

---

## 8. 접근 통제와 인가

- [x] [Insecure Direct Object Reference (IDOR)](https://owasp.org/www-community/attacks/insecure_direct_object_reference), [Insecure Direct Object Reference Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) (access-control)
- [x] [Forced browsing](https://owasp.org/www-community/attacks/Forced_browsing) (access-control)
- [x] [Web Parameter Tampering](https://owasp.org/www-community/attacks/Web_Parameter_Tampering) (access-control)
- [x] [Setting Manipulation](https://owasp.org/www-community/attacks/Setting_Manipulation) (access-control)
- [x] [Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) (access-control)
- [x] [Transaction Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html) (access-control)
- [x] [Mass Assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html) (access-control)
- [x] [Multi-Tenant Application Security](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html) (access-control)

---

## 9. 인증과 자격 증명

- [x] [Brute Force Attack](https://owasp.org/www-community/attacks/Brute_force_attack), [Password Spraying Attack](https://owasp.org/www-community/attacks/Password_Spraying_Attack), [Bot Management and Anti-Automation](https://cheatsheetseries.owasp.org/cheatsheets/Bot_Management_and_Anti-Automation_Cheat_Sheet.html) (credential-endpoint)
- [x] [Credential stuffing](https://owasp.org/www-community/attacks/Credential_stuffing), [Credential Stuffing Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html) (credential-endpoint)
- [x] [Qrljacking](https://owasp.org/www-community/attacks/Qrljacking) (federation)
- [x] [Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) (access-control)
- [x] [Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) (access-control)
- [x] [Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html), [Choosing and Using Security Questions](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html) (access-control)
- [x] [Email Validation and Verification in Identity Systems](https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html) (access-control)

---

## 10. 세션 관리

- [x] [Session fixation](https://owasp.org/www-community/attacks/Session_fixation), [Session hijacking attack](https://owasp.org/www-community/attacks/Session_hijacking_attack), [Session Prediction](https://owasp.org/www-community/attacks/Session_Prediction), [Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) (access-control)
- [x] [Cookie Theft Mitigation](https://cheatsheetseries.owasp.org/cheatsheets/Cookie_Theft_Mitigation_Cheat_Sheet.html) (access-control)

---

## 11. ID 페더레이션(OAuth / SAML / JWT)

- [x] [OAuth 2.0 Protocol](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html) (federation)
- [x] [SAML Security](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html) (federation)
- [x] [JSON Web Token for Java](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) (federation)

---

## 12. 암호 기술과 전송 보안

- [x] [Cryptanalysis](https://owasp.org/www-community/attacks/Cryptanalysis), [Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html), [Key Management](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html) (crypto)
- [x] [Manipulator-in-the-Middle (MITM)](https://owasp.org/www-community/attacks/Man-in-the-middle_attack), [Transport Layer Security](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) (transport)
- [x] [HTTP Strict Transport Security](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) (transport)
- [x] [Pinning](https://cheatsheetseries.owasp.org/cheatsheets/Pinning_Cheat_Sheet.html) (transport)

---

## 13. 서버 측 요청 위조(SSRF)

- [x] [Server Side Request Forgery](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery), [Server-Side Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) (network)

---

## 14. 경로 탐색(path traversal)과 파일 처리

- [x] [Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal) (path)
- [x] [Binary Planting](https://owasp.org/www-community/attacks/Binary_planting) (path)
- [x] [Windows ::DATA Alternate Data Stream](https://owasp.org/www-community/attacks/Windows_DATA_alternate_data_stream) (path)
- [x] [Embedding Null Code](https://owasp.org/www-community/attacks/Embedding_Null_Code) (path)
- [x] [File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) (upload)

---

## 15. HTTP 프로토콜 악용(헤더, 캐싱, 분할)

- [x] [HTTP Response Splitting](https://owasp.org/www-community/attacks/HTTP_Response_Splitting), [Cross-User Defacement](https://owasp.org/www-community/attacks/Cross-User_Defacement) (interpreter)
- [x] [HTTP Security Response Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) (browser, transport, http-request, access-control로 나눔)
- [x] [Cache Poisoning](https://owasp.org/www-community/attacks/Cache_Poisoning) (interpreter)
- [x] [IP Spoofing via HTTP Headers](https://owasp.org/www-community/attacks/ip_spoofing_via_http_headers) (http-request)

---

## 16. 인코딩과 콘텐츠 스푸핑

- [x] [Unicode Encoding](https://owasp.org/www-community/attacks/Unicode_Encoding) (interpreter)
- [x] [Double Encoding](https://owasp.org/www-community/Double_Encoding) (interpreter)
- [x] [Content Spoofing](https://owasp.org/www-community/attacks/Content_Spoofing) (browser)

---

## 17. CSV / 스프레드시트 인젝션

- [x] [CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection) (csv)

---

## 18. CORS(교차 출처 리소스 공유)

- [x] [CORS OriginHeaderScrutiny](https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny) (http-request)
- [x] [CORS RequestPreflightScrutiny](https://owasp.org/www-community/attacks/CORS_RequestPreflightScrutiny) (http-request)

---

## 19. 서비스 거부

- [x] [Regular expression Denial of Service (ReDoS)](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) (regex)

---

## 20. 메모리 안전성과 네이티브 코드

- [x] [Buffer Overflow Attack](https://owasp.org/www-community/attacks/Buffer_overflow_attack), [Buffer Overflow via Environment Variables](https://owasp.org/www-community/attacks/Buffer_Overflow_via_Environment_Variables) (c-cpp)
- [x] [Format string attack](https://owasp.org/www-community/attacks/Format_string_attack) (c-cpp)

---

## 21. 모바일 코드와 신뢰할 수 없는 코드 실행

- [x] [Mobile code invoking untrusted mobile code](https://owasp.org/www-community/attacks/Mobile_code_invoking_untrusted_mobile_code) (interpreter)
- [x] [Mobile code non-final public field](https://owasp.org/www-community/attacks/Mobile_code_non-final_public_field) (java)
- [x] [Mobile code object hijack](https://owasp.org/www-community/attacks/Mobile_code_object_hijack) (java)

---

## 22. 역직렬화

- [x] [Deserialization](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html) (python, ruby, php, java, dotnet으로 나눔)

---

## 23. 악성 코드와 클라이언트 측 위협

- [x] [Man-in-the-browser attack](https://owasp.org/www-community/attacks/Man-in-the-browser_attack), [Browser Extension Security Vulnerabilities](https://cheatsheetseries.owasp.org/cheatsheets/Browser_Extension_Vulnerabilities_Cheat_Sheet.html) (browser)
- [x] [Third Party JavaScript Management](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html) (browser)

---

## 24. 로깅, 부인(repudiation), 오류 처리

- [x] [Log Injection](https://owasp.org/www-community/attacks/Log_Injection), [Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), [Application Logging Vocabulary](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html) (interpreter)
- [x] [Repudiation Attack](https://owasp.org/www-community/attacks/Repudiation_Attack) (interpreter)

---

## 25. 비즈니스 로직과 기능 악용

비즈니스 로직과 기능 악용은 코드상의 공격 표면 하나로 좁혀지지 않으므로, 공격 표면별로 방어하는 전문 지식의 대상이 아닙니다. 방어는 애플리케이션에 맞춘 설계에 달려 있으며, 이는 프로젝트의 위협 모델링이 이끄는 것과 같은 추론입니다. "범위 밖"으로 옮겼습니다.

---

## 26. AI / LLM / 에이전트 보안

- [x] [Prompt Injection](https://owasp.org/www-community/attacks/prompt-injection), [LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) (llm)
- [x] [MCP Tool Poisoning](https://owasp.org/www-community/attacks/MCP_Tool_Poisoning), [MCP (Model Context Protocol) Security](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html) (llm)
- [x] [HITL Dialog Forging (Lies-in-the-Loop)](https://owasp.org/www-community/attacks/lies-in-the-loop) (llm)
- [x] [AI Agent Security](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html), [Secure Coding with AI](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html) (llm)
- [x] [Retrieval-Augmented Generation (RAG) Security](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html) (llm)
- [x] [Secure AI/ML Model Ops](https://cheatsheetseries.owasp.org/cheatsheets/Secure_AI_Model_Ops_Cheat_Sheet.html) (llm)
- [x] [AML and Sanctions Compliance for AI Agent Payments](https://cheatsheetseries.owasp.org/cheatsheets/AML_Sanctions_AI_Agent_Payments_Cheat_Sheet.html) (llm)

---

## 27. 프로토타입 오염과 크로스 사이트 리크

- [x] [Prototype Pollution Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html) (javascript)
- [x] [Cross-site leaks (XS-Leaks)](https://cheatsheetseries.owasp.org/cheatsheets/XS_Leaks_Cheat_Sheet.html) (browser)

---

## 28. 프레임워크와 언어 플랫폼

- [x] [Django Security](https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html), [Django REST Framework](https://cheatsheetseries.owasp.org/cheatsheets/Django_REST_Framework_Cheat_Sheet.html) (python)
- [x] [Ruby on Rails](https://cheatsheetseries.owasp.org/cheatsheets/Ruby_on_Rails_Cheat_Sheet.html) (ruby)
- [x] [Laravel](https://cheatsheetseries.owasp.org/cheatsheets/Laravel_Cheat_Sheet.html) (php)
- [x] [Symfony](https://cheatsheetseries.owasp.org/cheatsheets/Symfony_Cheat_Sheet.html) (php)
- [x] [Java Security](https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html) (java)
- [x] [DotNet Security](https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html) (dotnet)
- [x] [NodeJS Security](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html) (javascript)
- [x] [PHP Configuration](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html) (php)

---

## 29. 웹 프런트엔드와 브라우저

- [x] [HTML5 Security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html) (browser)
- [x] [AJAX Security](https://cheatsheetseries.owasp.org/cheatsheets/AJAX_Security_Cheat_Sheet.html) (browser)
- [x] [Securing Cascading Style Sheets](https://cheatsheetseries.owasp.org/cheatsheets/Securing_Cascading_Style_Sheets_Cheat_Sheet.html) (access-control, browser로 나눔)

---

## 30. API와 서비스

- [x] [GraphQL](https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html) (api-endpoint)
- [x] [gRPC Security](https://cheatsheetseries.owasp.org/cheatsheets/gRPC_Security_Cheat_Sheet.html) (api-endpoint)
- [x] [WebSocket Security](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html) (api-endpoint)

---

## 31. 클라우드, 컨테이너, 인프라

컨테이너와 워크로드 설정은 개발자가 앱과 함께 배포하는, 코드로 관리하는 설정(`Dockerfile`, Compose, Pod의 `securityContext`)입니다. `harden` 단계가 수정하고 `verify` 단계가 증명하는 실제 공격 표면이므로 범위 안에 포함합니다. 클러스터 관리(RBAC, etcd, API 서버, 어드미션 제어, 네트워크 분할)는 운영자의 영역이므로 범위 밖에 둡니다.

- [x] [Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html), [Node.js Docker](https://cheatsheetseries.owasp.org/cheatsheets/NodeJS_Docker_Cheat_Sheet.html) (container)
- [x] [Kubernetes Security](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) (container: 워크로드와 Pod 부분. 클러스터 관리는 범위 밖)
- [x] [Serverless / FaaS Security](https://cheatsheetseries.owasp.org/cheatsheets/Serverless_FaaS_Security_Cheat_Sheet.html) (serverless)

---

## 32. 공급망과 CI/CD

- [x] [NPM Security](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html) (interpreter)
- [x] [Dependency Graph & SBOM Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html), [Vulnerable Dependency Management](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html) (interpreter)

---

## 33. 시크릿과 설정

시크릿 관리는 볼트(vault), CI/CD, 클라우드 설정, 주기적 교체처럼 운영의 영역입니다. 코드 수준의 유일한 측면(소스 코드에 하드코딩된 시크릿)은 결정론적 스캔이 맡을 일이지, 위험을 다루는 전문 지식의 대상이 아닙니다. "범위 밖"으로 옮겼습니다.

---

## 34. 프로세스, 설계, 거버넌스

사용자 개인정보 보호는 정책과 설계의 문제(데이터 최소화, 투명성, 보존 기간)이며, 전문 지식이 방어하는 코드상의 공격 표면이 아닙니다. "범위 밖"으로 옮겼습니다.

---

## 35. 결제와 규정 준수

- [x] [Secure Integration of Third-Party Payment Gateways](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Payment_Gateway_Integration_Cheat_Sheet.html) (payment)

---

## 36. 임베디드 / IoT / 특수 분야

자동차와 드론 보안은 임베디드 시스템 영역(CAN 버스, OTA 펌웨어, 센서와 무선 신호의 무결성, 물리적 접근)으로, Lagune이 점검하는 웹이나 API 애플리케이션 소스 코드가 아닙니다. "범위 밖"으로 옮겼습니다.

---

## 범위 밖(코드상의 공격 표면 없음)

아래 항목은 전문 지식이 다루는 영역이 아니므로 체크박스가 없습니다. 거버넌스, 프로세스, 운영 측면의 보안 강화, 또는 프레임워크 사용법에 해당하며, 코드상의 공격 표면 하나로 좁혀지지 않아 공격 표면별로 방어하는 전문 지식의 대상이 되지 않습니다. 보안상의 가치는 분명하지만, 그 가치는 이 카탈로그가 제공하는 방어가 아니라 프로세스와 아키텍처(프레임워크라면 해당 언어 전용 스킬)에 있습니다. 작업 대상이 아니라 참고용으로 나열합니다.

- [Authorization Regression Testing](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Regression_Testing_Cheat_Sheet.html), [Authorization Testing Automation](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html)
- [JAAS](https://cheatsheetseries.owasp.org/cheatsheets/JAAS_Cheat_Sheet.html)
- [Denial of Service](https://owasp.org/www-community/attacks/Denial_of_Service), [Denial of Service](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [HTTP/2 Reset Attack](https://owasp.org/www-community/attacks/HTTP2_Reset_Attack)
- [Traffic flood](https://owasp.org/www-community/attacks/Traffic_flood)
- [Web Service Amplification Attack](https://owasp.org/www-community/attacks/web_service_amplificaiton) (SOAP/WS-Addressing 증폭 공격으로, 코드상의 공격 표면이 없는 운영 측면의 DoS 변형)
- [Cash Overflow](https://owasp.org/www-community/attacks/Cash_Overflow)
- [Spyware](https://owasp.org/www-community/attacks/Spyware), [Trojan Horse](https://owasp.org/www-community/attacks/Trojan_Horse) (최종 사용자를 노리는 악성 코드로, 감사 대상 프로젝트의 코드상의 공격 표면이 아님. 브라우저 안에서 전달되는 측면은 `browser` 전문 지식에서 다룸)
- [REST Security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html), [REST Assessment](https://cheatsheetseries.owasp.org/cheatsheets/REST_Assessment_Cheat_Sheet.html)
- [Web Service Security](https://cheatsheetseries.owasp.org/cheatsheets/Web_Service_Security_Cheat_Sheet.html)
- [Cloud Architecture Security](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Cloud_Architecture_Cheat_Sheet.html) (설계와 트레이드오프: IAM과 서명된 URL 중 선택, 퍼블릭 VPC와 프라이빗 VPC, 신뢰 경계, 공동 책임 모델. `container` 전문 지식과 달리, 전문 지식이 점검할 구체적인 설정이 없음)
- [Infrastructure as Code Security](https://cheatsheetseries.owasp.org/cheatsheets/Infrastructure_as_Code_Security_Cheat_Sheet.html) (이름과 달리, IaC를 _관리하기_ 위한 SDLC 프로세스와 도구를 다룸: IDE 플러그인, 정적 분석, 이미지 스캔, CI/CD, 서명. Terraform이나 CloudFormation 파일에서 안전하지 않은 패턴을 안전한 형태로 바꾸는 방법은 제시하지 않음)
- [Kubernetes Security](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) (_클러스터 관리 부분만 해당_: RBAC, etcd, API 서버, 어드미션 제어. 워크로드와 Pod 부분은 `container` 전문 지식에서 범위 안으로 다룸)
- [Network Segmentation](https://cheatsheetseries.owasp.org/cheatsheets/Network_Segmentation_Cheat_Sheet.html) (네트워크 아키텍처와 방화벽 정책)
- [Subdomain Takeover Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Subdomain_Takeover_Prevention_Cheat_Sheet.html) (DNS 수명 주기와 모니터링의 문제로, 코드가 아님)
- [Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) (볼트, CI/CD, 주기적 교체. 하드코딩된 시크릿 측면은 결정론적 스캔이 맡을 일로, 위험을 다루는 전문 지식의 대상이 아님)
- [C-Based Toolchain Hardening](https://cheatsheetseries.owasp.org/cheatsheets/C-Based_Toolchain_Hardening_Cheat_Sheet.html) (컴파일러, 링커, 빌드 플래그의 문제로, 소스 코드상의 싱크가 없음)
- [Microservices Security](https://cheatsheetseries.owasp.org/cheatsheets/Microservices_Security_Cheat_Sheet.html), [Microservices based Security Arch Doc](https://cheatsheetseries.owasp.org/cheatsheets/Microservices_based_Security_Arch_Doc_Cheat_Sheet.html)
- [Zero Trust Architecture](https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html)
- [CI/CD Security](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html), [GitHub Actions Security](https://cheatsheetseries.owasp.org/cheatsheets/GitHub_Actions_Security_Cheat_Sheet.html)
- [Software Supply Chain Security](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html)
- [Error Handling](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html), [Full Path Disclosure](https://owasp.org/www-community/attacks/Full_Path_Disclosure) (기술 스택별 전역 오류 핸들러 설정. 이 유출은 오류 처리가 이미 다루는 정보 노출과 같은 문제)
- [Abuse of Functionality](https://owasp.org/www-community/attacks/Abuse_of_Functionality), [Business Logic Security](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html), [Abuse Case (_과거 문서_)](https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html) (애플리케이션에 맞춘 설계의 문제로, 단일한 코드상의 싱크가 없음)
- [User Privacy Protection](https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html) (데이터 최소화, 투명성, 보존 정책)
- [Top 10 Automotive Security Vulnerabilities](https://cheatsheetseries.owasp.org/cheatsheets/Automotive_Security_Cheat_Sheet.html), [Drone Security](https://cheatsheetseries.owasp.org/cheatsheets/Drone_Security_Cheat_Sheet.html) (임베디드 시스템 영역: CAN 버스, OTA 펌웨어, 센서와 무선 신호의 무결성으로, 웹이나 API 소스 코드가 아님)
- [Mobile Application Security](https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html) (Android와 iOS 플랫폼 보안 강화: 스토리지, 생체 인증, 피닝, 개인 식별 정보(PII). 단일한 코드상의 공격 표면이 없으며, 신뢰할 수 없는 코드를 불러오는 측면은 `interpreter` 전문 지식으로 옮김)
- [Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html), [Threat Modeling (_커뮤니티 페이지_)](https://owasp.org/www-community/Threat_Modeling)
- [Attack Surface Analysis](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html)
- [Secure Product Design](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html)
- [Secure Code Review](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html)
- [Virtual Patching](https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html)
- [Vulnerability Disclosure](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html)
- [Legacy Application Management](https://cheatsheetseries.owasp.org/cheatsheets/Legacy_Application_Management_Cheat_Sheet.html)
- [Security Terminology](https://cheatsheetseries.owasp.org/cheatsheets/Security_Terminology_Cheat_Sheet.html)
