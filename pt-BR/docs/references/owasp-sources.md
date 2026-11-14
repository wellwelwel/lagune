# Fontes da OWASP

> Esta página está desatualizada em relação à versão em inglês. [Ler a versão original](https://lagune.ai/docs/references/owasp-sources).

> De onde vem o conhecimento das especializações nativas da categoria OWASP, mapeado para as páginas canônicas de ataques e Cheat Sheets da OWASP.

Canônica: https://lagune.ai/pt-BR/docs/references/owasp-sources
Idioma: pt-BR
Original: https://lagune.ai/docs/references/owasp-sources
Última atualização: 2026-11-03

Este documento mapeia cada **ataque** (`www-community`) e cada **Cheat Sheet** (`CheatSheetSeries`) da OWASP para uma categoria de segurança, cada um com o link para a página pública canônica dele. Dentro de uma categoria, itens equivalentes dividem uma única linha da lista: os ataques e as cheat sheets que tratam do mesmo risco aparecem juntos, separados por vírgula. Itens sem uma contrapartida direta ficam em uma linha própria.

- O crédito é da OWASP. Os ataques ficam em `https://owasp.org/www-community/attacks/<attack>` e as cheat sheets em `https://cheatsheetseries.owasp.org/cheatsheets/<cheat>.html`.

---

## 1. Injection (genérico)

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

## 2. Injection em SQL e bancos de dados

- [x] [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection), [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html), [Query Parameterization](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html) (sql)
- [x] [Blind SQL Injection](https://owasp.org/www-community/attacks/Blind_SQL_Injection) (sql)
- [x] [SQL Injection Bypassing WAF](https://owasp.org/www-community/attacks/SQL_Injection_Bypassing_WAF) (sql)
- [x] [RSQL Injection](https://owasp.org/www-community/attacks/RSQL_Injection) (interpreter)
- [x] [Database Security](https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html) (sql)
- [x] [NoSQL Security](https://cheatsheetseries.owasp.org/cheatsheets/NoSQL_Security_Cheat_Sheet.html) (interpreter)

---

## 3. Injection de comandos do sistema operacional

- [x] [Command Injection](https://owasp.org/www-community/attacks/Command_Injection), [OS Command Injection Defense](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html) (interpreter)

---

## 4. Injection em LDAP, XPath e XML

- [x] [LDAP Injection](https://owasp.org/www-community/attacks/LDAP_Injection), [LDAP Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html) (interpreter)
- [x] [XPATH Injection](https://owasp.org/www-community/attacks/XPATH_Injection) (interpreter)
- [x] [Blind XPath Injection](https://owasp.org/www-community/attacks/Blind_XPath_Injection) (interpreter)
- [x] [XML External Entity (XXE) Prevention](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html), [XML Security](https://cheatsheetseries.owasp.org/cheatsheets/XML_Security_Cheat_Sheet.html) (xml)

---

## 5. Cross-Site Scripting (XSS)

- [x] [Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/Cross-site-Scripting-%28XSS%29), [Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [XSS Filter Evasion](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html) (browser)
- [x] [DOM Based XSS](https://owasp.org/www-community/attacks/DOM_Based_XSS), [DOM based XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html), [DOM Clobbering Prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html) (browser)
- [x] [Reflected DOM Injection](https://owasp.org/www-community/attacks/Reflected_DOM_Injection) (browser)
- [x] [XSS in Converting File Content to Text](https://owasp.org/www-community/attacks/XSS_in_Converting_File_Content_to_Text) (browser)
- [x] [XSS in subtitle](https://owasp.org/www-community/attacks/Xss_in_subtitle) (browser)
- [x] [Cross Frame Scripting](https://owasp.org/www-community/attacks/Cross_Frame_Scripting) (browser)
- [x] [Cross Site Tracing](https://owasp.org/www-community/attacks/Cross_Site_Tracing) (browser)
- [x] [Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) (browser)

---

## 6. Cross-Site Request Forgery (CSRF) e clickjacking

- [x] [Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/cross-site-request-forgery), [XSRF](https://owasp.org/www-community/attacks/XSRF), [Cross-Site Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) (http-request)
- [x] [Clickjacking](https://owasp.org/www-community/attacks/Clickjacking), [Clickjacking Defense](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html) (browser)
- [x] [Cross Site History Manipulation (XSHM)](https://owasp.org/www-community/attacks/Cross_Site_History_Manipulation_%28XSHM%29) (browser)
- [x] [Form action hijacking](https://owasp.org/www-community/attacks/Form_action_hijacking) (network)
- [x] [Reverse Tabnabbing](https://owasp.org/www-community/attacks/Reverse_Tabnabbing) (browser)

---

## 7. Redirecionamentos e encaminhamentos

- [x] [Open Redirect](https://owasp.org/www-community/attacks/open_redirect), [Unvalidated Redirects and Forwards](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) (network)
- [x] [Execution After Redirect (EAR)](https://owasp.org/www-community/attacks/Execution_After_Redirect_%28EAR%29) (browser)

---

## 8. Controle de acesso e autorização

- [x] [Insecure Direct Object Reference (IDOR)](https://owasp.org/www-community/attacks/insecure_direct_object_reference), [Insecure Direct Object Reference Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) (access-control)
- [x] [Forced browsing](https://owasp.org/www-community/attacks/Forced_browsing) (access-control)
- [x] [Web Parameter Tampering](https://owasp.org/www-community/attacks/Web_Parameter_Tampering) (access-control)
- [x] [Setting Manipulation](https://owasp.org/www-community/attacks/Setting_Manipulation) (access-control)
- [x] [Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) (access-control)
- [x] [Transaction Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html) (access-control)
- [x] [Mass Assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html) (access-control)
- [x] [Multi-Tenant Application Security](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html) (access-control)

---

## 9. Autenticação e credenciais

- [x] [Brute Force Attack](https://owasp.org/www-community/attacks/Brute_force_attack), [Password Spraying Attack](https://owasp.org/www-community/attacks/Password_Spraying_Attack), [Bot Management and Anti-Automation](https://cheatsheetseries.owasp.org/cheatsheets/Bot_Management_and_Anti-Automation_Cheat_Sheet.html) (credential-endpoint)
- [x] [Credential stuffing](https://owasp.org/www-community/attacks/Credential_stuffing), [Credential Stuffing Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html) (credential-endpoint)
- [x] [Qrljacking](https://owasp.org/www-community/attacks/Qrljacking) (federation)
- [x] [Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) (access-control)
- [x] [Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) (access-control)
- [x] [Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html), [Choosing and Using Security Questions](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html) (access-control)
- [x] [Email Validation and Verification in Identity Systems](https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html) (access-control)

---

## 10. Gerenciamento de sessão

- [x] [Session fixation](https://owasp.org/www-community/attacks/Session_fixation), [Session hijacking attack](https://owasp.org/www-community/attacks/Session_hijacking_attack), [Session Prediction](https://owasp.org/www-community/attacks/Session_Prediction), [Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) (access-control)
- [x] [Cookie Theft Mitigation](https://cheatsheetseries.owasp.org/cheatsheets/Cookie_Theft_Mitigation_Cheat_Sheet.html) (access-control)

---

## 11. Federação de identidade (OAuth, SAML e JWT)

- [x] [OAuth 2.0 Protocol](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html) (federation)
- [x] [SAML Security](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html) (federation)
- [x] [JSON Web Token for Java](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) (federation)

---

## 12. Criptografia e segurança de transporte

- [x] [Cryptanalysis](https://owasp.org/www-community/attacks/Cryptanalysis), [Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html), [Key Management](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html) (crypto)
- [x] [Manipulator-in-the-Middle (MITM)](https://owasp.org/www-community/attacks/Man-in-the-middle_attack), [Transport Layer Security](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) (transport)
- [x] [HTTP Strict Transport Security](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) (transport)
- [x] [Pinning](https://cheatsheetseries.owasp.org/cheatsheets/Pinning_Cheat_Sheet.html) (transport)

---

## 13. Server-Side Request Forgery (SSRF)

- [x] [Server Side Request Forgery](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery), [Server-Side Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) (network)

---

## 14. Path traversal e manipulação de arquivos

- [x] [Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal) (path)
- [x] [Binary Planting](https://owasp.org/www-community/attacks/Binary_planting) (path)
- [x] [Windows ::DATA Alternate Data Stream](https://owasp.org/www-community/attacks/Windows_DATA_alternate_data_stream) (path)
- [x] [Embedding Null Code](https://owasp.org/www-community/attacks/Embedding_Null_Code) (path)
- [x] [File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) (upload)

---

## 15. Abuso do protocolo HTTP (headers, cache e splitting)

- [x] [HTTP Response Splitting](https://owasp.org/www-community/attacks/HTTP_Response_Splitting), [Cross-User Defacement](https://owasp.org/www-community/attacks/Cross-User_Defacement) (interpreter)
- [x] [HTTP Security Response Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) (dividido entre: browser, transport, http-request, access-control)
- [x] [Cache Poisoning](https://owasp.org/www-community/attacks/Cache_Poisoning) (interpreter)
- [x] [IP Spoofing via HTTP Headers](https://owasp.org/www-community/attacks/ip_spoofing_via_http_headers) (http-request)

---

## 16. Encoding e content spoofing

- [x] [Unicode Encoding](https://owasp.org/www-community/attacks/Unicode_Encoding) (interpreter)
- [x] [Double Encoding](https://owasp.org/www-community/Double_Encoding) (interpreter)
- [x] [Content Spoofing](https://owasp.org/www-community/attacks/Content_Spoofing) (browser)

---

## 17. Injection em CSV e planilhas

- [x] [CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection) (csv)

---

## 18. CORS (Cross-Origin Resource Sharing)

- [x] [CORS OriginHeaderScrutiny](https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny) (http-request)
- [x] [CORS RequestPreflightScrutiny](https://owasp.org/www-community/attacks/CORS_RequestPreflightScrutiny) (http-request)

---

## 19. Negação de serviço

- [x] [Regular expression Denial of Service (ReDoS)](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) (regex)

---

## 20. Segurança de memória e código nativo

- [x] [Buffer Overflow Attack](https://owasp.org/www-community/attacks/Buffer_overflow_attack), [Buffer Overflow via Environment Variables](https://owasp.org/www-community/attacks/Buffer_Overflow_via_Environment_Variables) (c-cpp)
- [x] [Format string attack](https://owasp.org/www-community/attacks/Format_string_attack) (c-cpp)

---

## 21. Código móvel e execução de código não confiável

- [x] [Mobile code invoking untrusted mobile code](https://owasp.org/www-community/attacks/Mobile_code_invoking_untrusted_mobile_code) (interpreter)
- [x] [Mobile code non-final public field](https://owasp.org/www-community/attacks/Mobile_code_non-final_public_field) (java)
- [x] [Mobile code object hijack](https://owasp.org/www-community/attacks/Mobile_code_object_hijack) (java)

---

## 22. Desserialização

- [x] [Deserialization](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html) (dividido entre: python, ruby, php, java, dotnet)

---

## 23. Malware e ameaças no lado do cliente

- [x] [Man-in-the-browser attack](https://owasp.org/www-community/attacks/Man-in-the-browser_attack), [Browser Extension Security Vulnerabilities](https://cheatsheetseries.owasp.org/cheatsheets/Browser_Extension_Vulnerabilities_Cheat_Sheet.html) (browser)
- [x] [Third Party JavaScript Management](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html) (browser)

---

## 24. Logging, repúdio e tratamento de erros

- [x] [Log Injection](https://owasp.org/www-community/attacks/Log_Injection), [Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), [Application Logging Vocabulary](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html) (interpreter)
- [x] [Repudiation Attack](https://owasp.org/www-community/attacks/Repudiation_Attack) (interpreter)

---

## 25. Lógica de negócio e abuso de funcionalidade

Lógica de negócio e abuso de funcionalidade não têm uma superfície única no código que uma especialização por superfície defenda: a defesa é um design específico da aplicação, o mesmo raciocínio que conduz a modelagem de ameaças do projeto. Movido para "Fora do escopo".

---

## 26. Segurança de IA, LLMs e agentes

- [x] [Prompt Injection](https://owasp.org/www-community/attacks/prompt-injection), [LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) (llm)
- [x] [MCP Tool Poisoning](https://owasp.org/www-community/attacks/MCP_Tool_Poisoning), [MCP (Model Context Protocol) Security](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html) (llm)
- [x] [HITL Dialog Forging (Lies-in-the-Loop)](https://owasp.org/www-community/attacks/lies-in-the-loop) (llm)
- [x] [AI Agent Security](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html), [Secure Coding with AI](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html) (llm)
- [x] [Retrieval-Augmented Generation (RAG) Security](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html) (llm)
- [x] [Secure AI/ML Model Ops](https://cheatsheetseries.owasp.org/cheatsheets/Secure_AI_Model_Ops_Cheat_Sheet.html) (llm)
- [x] [AML and Sanctions Compliance for AI Agent Payments](https://cheatsheetseries.owasp.org/cheatsheets/AML_Sanctions_AI_Agent_Payments_Cheat_Sheet.html) (llm)

---

## 27. Prototype pollution e cross-site leaks

- [x] [Prototype Pollution Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html) (javascript)
- [x] [Cross-site leaks (XS-Leaks)](https://cheatsheetseries.owasp.org/cheatsheets/XS_Leaks_Cheat_Sheet.html) (browser)

---

## 28. Frameworks e plataformas de linguagem

- [x] [Django Security](https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html), [Django REST Framework](https://cheatsheetseries.owasp.org/cheatsheets/Django_REST_Framework_Cheat_Sheet.html) (python)
- [x] [Ruby on Rails](https://cheatsheetseries.owasp.org/cheatsheets/Ruby_on_Rails_Cheat_Sheet.html) (ruby)
- [x] [Laravel](https://cheatsheetseries.owasp.org/cheatsheets/Laravel_Cheat_Sheet.html) (php)
- [x] [Symfony](https://cheatsheetseries.owasp.org/cheatsheets/Symfony_Cheat_Sheet.html) (php)
- [x] [Java Security](https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html) (java)
- [x] [DotNet Security](https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html) (dotnet)
- [x] [NodeJS Security](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html) (javascript)
- [x] [PHP Configuration](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html) (php)

---

## 29. Front-end web e navegador

- [x] [HTML5 Security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html) (browser)
- [x] [AJAX Security](https://cheatsheetseries.owasp.org/cheatsheets/AJAX_Security_Cheat_Sheet.html) (browser)
- [x] [Securing Cascading Style Sheets](https://cheatsheetseries.owasp.org/cheatsheets/Securing_Cascading_Style_Sheets_Cheat_Sheet.html) (dividido entre: access-control, browser)

---

## 30. APIs e serviços

- [x] [GraphQL](https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html) (api-endpoint)
- [x] [gRPC Security](https://cheatsheetseries.owasp.org/cheatsheets/gRPC_Security_Cheat_Sheet.html) (api-endpoint)
- [x] [WebSocket Security](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html) (api-endpoint)

---

## 31. Nuvem, contêineres e infraestrutura

A configuração de contêineres e workloads é configuração como código que quem desenvolve entrega junto com o app (`Dockerfile`, Compose, `securityContext` do Pod), uma superfície real que o `harden` corrige e o `verify` comprova, então ela está no escopo. A administração do cluster (RBAC, etcd, API server, admission, segmentação de rede) é domínio de quem opera a infraestrutura e fica fora do escopo.

- [x] [Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html), [Node.js Docker](https://cheatsheetseries.owasp.org/cheatsheets/NodeJS_Docker_Cheat_Sheet.html) (container)
- [x] [Kubernetes Security](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) (container: a parte de workloads e Pods. A administração do cluster fica fora do escopo)
- [x] [Serverless / FaaS Security](https://cheatsheetseries.owasp.org/cheatsheets/Serverless_FaaS_Security_Cheat_Sheet.html) (serverless)

---

## 32. Cadeia de suprimentos e CI/CD

- [x] [NPM Security](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html) (interpreter)
- [x] [Dependency Graph & SBOM Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html), [Vulnerable Dependency Management](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html) (interpreter)

---

## 33. Segredos e configuração

O gerenciamento de segredos é operacional: cofres, CI/CD, configuração de nuvem e rotação. A única faceta no nível do código (um segredo fixo no código-fonte) é uma varredura determinística, não uma especialização de risco. Movido para "Fora do escopo".

---

## 34. Processo, design e governança

A proteção da privacidade do usuário é questão de política e de design (minimização de dados, transparência e retenção), não uma superfície no código que uma especialização defenda. Movido para "Fora do escopo".

---

## 35. Pagamentos e conformidade

- [x] [Secure Integration of Third-Party Payment Gateways](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Payment_Gateway_Integration_Cheat_Sheet.html) (payment)

---

## 36. Sistemas embarcados, IoT e domínios especializados

A segurança automotiva e a de drones são domínios de sistemas embarcados (barramento CAN, firmware OTA, integridade de sensores e rádio, acesso físico), e não o código-fonte de aplicações web e APIs que o Lagune audita. Movido para "Fora do escopo".

---

## Fora do escopo (sem superfície no código)

Estes itens não são terreno de especializações e não têm checkbox: são governança, processo, hardening operacional ou uso de frameworks, sem uma superfície única no código que uma especialização por superfície defenda. O valor deles para a segurança é real, mas está no processo e na arquitetura (ou, no caso de um framework, na skill da própria linguagem), e não em uma defesa que este catálogo entrega. Aparecem como referência, não como trabalho a fazer.

- [Authorization Regression Testing](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Regression_Testing_Cheat_Sheet.html), [Authorization Testing Automation](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html)
- [JAAS](https://cheatsheetseries.owasp.org/cheatsheets/JAAS_Cheat_Sheet.html)
- [Denial of Service](https://owasp.org/www-community/attacks/Denial_of_Service), [Denial of Service](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [HTTP/2 Reset Attack](https://owasp.org/www-community/attacks/HTTP2_Reset_Attack)
- [Traffic flood](https://owasp.org/www-community/attacks/Traffic_flood)
- [Web Service Amplification Attack](https://owasp.org/www-community/attacks/web_service_amplificaiton) (amplificação via SOAP e WS-Addressing, uma variante operacional de DoS sem superfície no código)
- [Cash Overflow](https://owasp.org/www-community/attacks/Cash_Overflow)
- [Spyware](https://owasp.org/www-community/attacks/Spyware), [Trojan Horse](https://owasp.org/www-community/attacks/Trojan_Horse) (malware no usuário final, não uma superfície no código do projeto auditado. A faceta de entrega pelo navegador fica em `browser`)
- [REST Security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html), [REST Assessment](https://cheatsheetseries.owasp.org/cheatsheets/REST_Assessment_Cheat_Sheet.html)
- [Web Service Security](https://cheatsheetseries.owasp.org/cheatsheets/Web_Service_Security_Cheat_Sheet.html)
- [Cloud Architecture Security](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Cloud_Architecture_Cheat_Sheet.html) (design e trade-offs: IAM versus URLs assinadas, VPCs públicas e privadas, fronteiras de confiança e responsabilidade compartilhada. Ao contrário de `container`, não tem uma configuração concreta que uma especialização verifique)
- [Infrastructure as Code Security](https://cheatsheetseries.owasp.org/cheatsheets/Infrastructure_as_Code_Security_Cheat_Sheet.html) (apesar do nome, trata do processo de SDLC e das ferramentas para _gerenciar_ IaC: plugins de IDE, análise estática, varredura de imagens, CI/CD e assinatura. Não oferece um padrão inseguro a converter em forma segura dentro de um arquivo Terraform ou CloudFormation)
- [Kubernetes Security](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) (_apenas a parte de administração do cluster_: RBAC, etcd, API server e admission. A parte de workloads e Pods está no escopo em `container`)
- [Network Segmentation](https://cheatsheetseries.owasp.org/cheatsheets/Network_Segmentation_Cheat_Sheet.html) (arquitetura de rede e política de firewall)
- [Subdomain Takeover Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Subdomain_Takeover_Prevention_Cheat_Sheet.html) (ciclo de vida e monitoramento de DNS, não código)
- [Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) (cofres, CI/CD e rotação. A faceta do segredo fixo no código é uma varredura determinística, não uma especialização de risco)
- [C-Based Toolchain Hardening](https://cheatsheetseries.owasp.org/cheatsheets/C-Based_Toolchain_Hardening_Cheat_Sheet.html) (flags de compilador, linker e build, sem um sink no código-fonte)
- [Microservices Security](https://cheatsheetseries.owasp.org/cheatsheets/Microservices_Security_Cheat_Sheet.html), [Microservices based Security Arch Doc](https://cheatsheetseries.owasp.org/cheatsheets/Microservices_based_Security_Arch_Doc_Cheat_Sheet.html)
- [Zero Trust Architecture](https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html)
- [CI/CD Security](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html), [GitHub Actions Security](https://cheatsheetseries.owasp.org/cheatsheets/GitHub_Actions_Security_Cheat_Sheet.html)
- [Software Supply Chain Security](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html)
- [Error Handling](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html), [Full Path Disclosure](https://owasp.org/www-community/attacks/Full_Path_Disclosure) (configuração global do tratamento de erros em cada stack. O vazamento é a mesma exposição que o tratamento de erros já rege)
- [Abuse of Functionality](https://owasp.org/www-community/attacks/Abuse_of_Functionality), [Business Logic Security](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html), [Abuse Case _(historical)_](https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html) (design específico da aplicação, sem um sink único no código)
- [User Privacy Protection](https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html) (minimização de dados, transparência e política de retenção)
- [Top 10 Automotive Security Vulnerabilities](https://cheatsheetseries.owasp.org/cheatsheets/Automotive_Security_Cheat_Sheet.html), [Drone Security](https://cheatsheetseries.owasp.org/cheatsheets/Drone_Security_Cheat_Sheet.html) (domínios de sistemas embarcados, como barramento CAN, firmware OTA e integridade de sensores e rádio, e não código-fonte web ou de APIs)
- [Mobile Application Security](https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html) (hardening das plataformas Android e iOS, como armazenamento, biometria, pinning e dados pessoais. Não tem uma superfície única no código, e a faceta de carregamento de código não confiável foi para `interpreter`)
- [Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html), [Threat Modeling _(community page)_](https://owasp.org/www-community/Threat_Modeling)
- [Attack Surface Analysis](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html)
- [Secure Product Design](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html)
- [Secure Code Review](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html)
- [Virtual Patching](https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html)
- [Vulnerability Disclosure](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html)
- [Legacy Application Management](https://cheatsheetseries.owasp.org/cheatsheets/Legacy_Application_Management_Cheat_Sheet.html)
- [Security Terminology](https://cheatsheetseries.owasp.org/cheatsheets/Security_Terminology_Cheat_Sheet.html)
