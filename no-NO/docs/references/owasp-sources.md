# OWASP-kilder

> Hvor kunnskapen i de innebygde OWASP-spesialiseringene kommer fra, koblet til de kanoniske OWASP-sidene om angrep og Cheat Sheets.

Kanonisk URL: https://lagune.ai/no-NO/docs/references/owasp-sources
Språk: no-NO
Original: https://lagune.ai/docs/references/owasp-sources
Sist oppdatert: 2026-11-09

Dette dokumentet knytter hvert **angrep** (`www-community`) og hvert **Cheat Sheet** (`CheatSheetSeries`) fra OWASP til en sikkerhetskategori, hver med lenke til den kanoniske offentlige siden. Innenfor en kategori deler likeverdige oppføringer én linje i sjekklisten: Angrepene og Cheat Sheets som håndterer den samme risikoen, står sammen, skilt med komma. Oppføringer uten en direkte motpart står på en egen linje.

- Æren tilhører OWASP. Angrepene ligger på `https://owasp.org/www-community/attacks/<attack>`, og Cheat Sheets på `https://cheatsheetseries.owasp.org/cheatsheets/<cheat>.html`.

---

## 1. Injeksjon (generelt)

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

## 2. SQL- og databaseinjeksjon

- [x] [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection), [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html), [Query Parameterization](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html) (sql)
- [x] [Blind SQL Injection](https://owasp.org/www-community/attacks/Blind_SQL_Injection) (sql)
- [x] [SQL Injection Bypassing WAF](https://owasp.org/www-community/attacks/SQL_Injection_Bypassing_WAF) (sql)
- [x] [RSQL Injection](https://owasp.org/www-community/attacks/RSQL_Injection) (interpreter)
- [x] [Database Security](https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html) (sql)
- [x] [NoSQL Security](https://cheatsheetseries.owasp.org/cheatsheets/NoSQL_Security_Cheat_Sheet.html) (interpreter)

---

## 3. OS- og kommandoinjeksjon

- [x] [Command Injection](https://owasp.org/www-community/attacks/Command_Injection), [OS Command Injection Defense](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html) (interpreter)

---

## 4. LDAP-, XPath- og XML-injeksjon

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

## 6. Cross-Site Request Forgery (CSRF) og clickjacking

- [x] [Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/cross-site-request-forgery), [XSRF](https://owasp.org/www-community/attacks/XSRF), [Cross-Site Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) (http-request)
- [x] [Clickjacking](https://owasp.org/www-community/attacks/Clickjacking), [Clickjacking Defense](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html) (browser)
- [x] [Cross Site History Manipulation (XSHM)](https://owasp.org/www-community/attacks/Cross_Site_History_Manipulation_%28XSHM%29) (browser)
- [x] [Form action hijacking](https://owasp.org/www-community/attacks/Form_action_hijacking) (network)
- [x] [Reverse Tabnabbing](https://owasp.org/www-community/attacks/Reverse_Tabnabbing) (browser)

---

## 7. Omdirigeringer og videresendinger

- [x] [Open Redirect](https://owasp.org/www-community/attacks/open_redirect), [Unvalidated Redirects and Forwards](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) (network)
- [x] [Execution After Redirect (EAR)](https://owasp.org/www-community/attacks/Execution_After_Redirect_%28EAR%29) (browser)

---

## 8. Tilgangskontroll og autorisasjon

- [x] [Insecure Direct Object Reference (IDOR)](https://owasp.org/www-community/attacks/insecure_direct_object_reference), [Insecure Direct Object Reference Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) (access-control)
- [x] [Forced browsing](https://owasp.org/www-community/attacks/Forced_browsing) (access-control)
- [x] [Web Parameter Tampering](https://owasp.org/www-community/attacks/Web_Parameter_Tampering) (access-control)
- [x] [Setting Manipulation](https://owasp.org/www-community/attacks/Setting_Manipulation) (access-control)
- [x] [Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) (access-control)
- [x] [Transaction Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html) (access-control)
- [x] [Mass Assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html) (access-control)
- [x] [Multi-Tenant Application Security](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html) (access-control)

---

## 9. Autentisering og påloggingsdetaljer

- [x] [Brute Force Attack](https://owasp.org/www-community/attacks/Brute_force_attack), [Password Spraying Attack](https://owasp.org/www-community/attacks/Password_Spraying_Attack), [Bot Management and Anti-Automation](https://cheatsheetseries.owasp.org/cheatsheets/Bot_Management_and_Anti-Automation_Cheat_Sheet.html) (credential-endpoint)
- [x] [Credential stuffing](https://owasp.org/www-community/attacks/Credential_stuffing), [Credential Stuffing Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html) (credential-endpoint)
- [x] [Qrljacking](https://owasp.org/www-community/attacks/Qrljacking) (federation)
- [x] [Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) (access-control)
- [x] [Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) (access-control)
- [x] [Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html), [Choosing and Using Security Questions](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html) (access-control)
- [x] [Email Validation and Verification in Identity Systems](https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html) (access-control)

---

## 10. Økthåndtering

- [x] [Session fixation](https://owasp.org/www-community/attacks/Session_fixation), [Session hijacking attack](https://owasp.org/www-community/attacks/Session_hijacking_attack), [Session Prediction](https://owasp.org/www-community/attacks/Session_Prediction), [Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) (access-control)
- [x] [Cookie Theft Mitigation](https://cheatsheetseries.owasp.org/cheatsheets/Cookie_Theft_Mitigation_Cheat_Sheet.html) (access-control)

---

## 11. Identitetsføderasjon (OAuth, SAML og JWT)

- [x] [OAuth 2.0 Protocol](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html) (federation)
- [x] [SAML Security](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html) (federation)
- [x] [JSON Web Token for Java](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) (federation)

---

## 12. Kryptografi og transportsikkerhet

- [x] [Cryptanalysis](https://owasp.org/www-community/attacks/Cryptanalysis), [Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html), [Key Management](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html) (crypto)
- [x] [Manipulator-in-the-Middle (MITM)](https://owasp.org/www-community/attacks/Man-in-the-middle_attack), [Transport Layer Security](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) (transport)
- [x] [HTTP Strict Transport Security](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) (transport)
- [x] [Pinning](https://cheatsheetseries.owasp.org/cheatsheets/Pinning_Cheat_Sheet.html) (transport)

---

## 13. Server-Side Request Forgery (SSRF)

- [x] [Server Side Request Forgery](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery), [Server-Side Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) (network)

---

## 14. Path traversal og filhåndtering

- [x] [Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal) (path)
- [x] [Binary Planting](https://owasp.org/www-community/attacks/Binary_planting) (path)
- [x] [Windows ::DATA Alternate Data Stream](https://owasp.org/www-community/attacks/Windows_DATA_alternate_data_stream) (path)
- [x] [Embedding Null Code](https://owasp.org/www-community/attacks/Embedding_Null_Code) (path)
- [x] [File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) (upload)

---

## 15. Misbruk av HTTP-protokollen (headere, caching, splitting)

- [x] [HTTP Response Splitting](https://owasp.org/www-community/attacks/HTTP_Response_Splitting), [Cross-User Defacement](https://owasp.org/www-community/attacks/Cross-User_Defacement) (interpreter)
- [x] [HTTP Security Response Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) (fordelt på browser, transport, http-request og access-control)
- [x] [Cache Poisoning](https://owasp.org/www-community/attacks/Cache_Poisoning) (interpreter)
- [x] [IP Spoofing via HTTP Headers](https://owasp.org/www-community/attacks/ip_spoofing_via_http_headers) (http-request)

---

## 16. Koding og innholdsforfalskning

- [x] [Unicode Encoding](https://owasp.org/www-community/attacks/Unicode_Encoding) (interpreter)
- [x] [Double Encoding](https://owasp.org/www-community/Double_Encoding) (interpreter)
- [x] [Content Spoofing](https://owasp.org/www-community/attacks/Content_Spoofing) (browser)

---

## 17. CSV- og regnearkinjeksjon

- [x] [CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection) (csv)

---

## 18. CORS (Cross-Origin Resource Sharing)

- [x] [CORS OriginHeaderScrutiny](https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny) (http-request)
- [x] [CORS RequestPreflightScrutiny](https://owasp.org/www-community/attacks/CORS_RequestPreflightScrutiny) (http-request)

---

## 19. Tjenestenekt

- [x] [Regular expression Denial of Service (ReDoS)](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) (regex)

---

## 20. Minnesikkerhet og native kode

- [x] [Buffer Overflow Attack](https://owasp.org/www-community/attacks/Buffer_overflow_attack), [Buffer Overflow via Environment Variables](https://owasp.org/www-community/attacks/Buffer_Overflow_via_Environment_Variables) (c-cpp)
- [x] [Format string attack](https://owasp.org/www-community/attacks/Format_string_attack) (c-cpp)

---

## 21. Mobil kode og kjøring av ikke-klarert kode

- [x] [Mobile code invoking untrusted mobile code](https://owasp.org/www-community/attacks/Mobile_code_invoking_untrusted_mobile_code) (interpreter)
- [x] [Mobile code non-final public field](https://owasp.org/www-community/attacks/Mobile_code_non-final_public_field) (java)
- [x] [Mobile code object hijack](https://owasp.org/www-community/attacks/Mobile_code_object_hijack) (java)

---

## 22. Deserialisering

- [x] [Deserialization](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html) (fordelt på python, ruby, php, java og dotnet)

---

## 23. Skadevare og trusler på klientsiden

- [x] [Man-in-the-browser attack](https://owasp.org/www-community/attacks/Man-in-the-browser_attack), [Browser Extension Security Vulnerabilities](https://cheatsheetseries.owasp.org/cheatsheets/Browser_Extension_Vulnerabilities_Cheat_Sheet.html) (browser)
- [x] [Third Party JavaScript Management](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html) (browser)

---

## 24. Logging, benektelse og feilhåndtering

- [x] [Log Injection](https://owasp.org/www-community/attacks/Log_Injection), [Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), [Application Logging Vocabulary](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html) (interpreter)
- [x] [Repudiation Attack](https://owasp.org/www-community/attacks/Repudiation_Attack) (interpreter)

---

## 25. Forretningslogikk og misbruk av funksjonalitet

Forretningslogikk og misbruk av funksjonalitet har ingen enkelt flate i koden som en spesialisering per flate kan forsvare: Forsvaret ligger i applikasjonsspesifikt design, den samme vurderingen som trusselmodelleringen i prosjektet driver. Flyttet til "Utenfor omfanget".

---

## 26. Sikkerhet for KI, LLM og agenter

- [x] [Prompt Injection](https://owasp.org/www-community/attacks/prompt-injection), [LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) (llm)
- [x] [MCP Tool Poisoning](https://owasp.org/www-community/attacks/MCP_Tool_Poisoning), [MCP (Model Context Protocol) Security](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html) (llm)
- [x] [HITL Dialog Forging (Lies-in-the-Loop)](https://owasp.org/www-community/attacks/lies-in-the-loop) (llm)
- [x] [AI Agent Security](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html), [Secure Coding with AI](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html) (llm)
- [x] [Retrieval-Augmented Generation (RAG) Security](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html) (llm)
- [x] [Secure AI/ML Model Ops](https://cheatsheetseries.owasp.org/cheatsheets/Secure_AI_Model_Ops_Cheat_Sheet.html) (llm)
- [x] [AML and Sanctions Compliance for AI Agent Payments](https://cheatsheetseries.owasp.org/cheatsheets/AML_Sanctions_AI_Agent_Payments_Cheat_Sheet.html) (llm)

---

## 27. Prototype pollution og cross-site leaks

- [x] [Prototype Pollution Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html) (javascript)
- [x] [Cross-site leaks (XS-Leaks)](https://cheatsheetseries.owasp.org/cheatsheets/XS_Leaks_Cheat_Sheet.html) (browser)

---

## 28. Rammeverk og språkplattformer

- [x] [Django Security](https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html), [Django REST Framework](https://cheatsheetseries.owasp.org/cheatsheets/Django_REST_Framework_Cheat_Sheet.html) (python)
- [x] [Ruby on Rails](https://cheatsheetseries.owasp.org/cheatsheets/Ruby_on_Rails_Cheat_Sheet.html) (ruby)
- [x] [Laravel](https://cheatsheetseries.owasp.org/cheatsheets/Laravel_Cheat_Sheet.html) (php)
- [x] [Symfony](https://cheatsheetseries.owasp.org/cheatsheets/Symfony_Cheat_Sheet.html) (php)
- [x] [Java Security](https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html) (java)
- [x] [DotNet Security](https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html) (dotnet)
- [x] [NodeJS Security](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html) (javascript)
- [x] [PHP Configuration](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html) (php)

---

## 29. Webfrontend og nettleser

- [x] [HTML5 Security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html) (browser)
- [x] [AJAX Security](https://cheatsheetseries.owasp.org/cheatsheets/AJAX_Security_Cheat_Sheet.html) (browser)
- [x] [Securing Cascading Style Sheets](https://cheatsheetseries.owasp.org/cheatsheets/Securing_Cascading_Style_Sheets_Cheat_Sheet.html) (fordelt på access-control og browser)

---

## 30. API-er og tjenester

- [x] [GraphQL](https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html) (api-endpoint)
- [x] [gRPC Security](https://cheatsheetseries.owasp.org/cheatsheets/gRPC_Security_Cheat_Sheet.html) (api-endpoint)
- [x] [WebSocket Security](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html) (api-endpoint)

---

## 31. Sky, containere og infrastruktur

Konfigurasjon av containere og arbeidslaster er konfigurasjon som kode som utvikleren leverer sammen med appen (`Dockerfile`, Compose, `securityContext` for Pod), en reell flate som `harden` utbedrer og `verify` beviser, så den er innenfor omfanget. Klyngeadministrasjon (RBAC, etcd, API-server, admission, nettverkssegmentering) er driftsansvarliges domene og holdes utenfor omfanget.

- [x] [Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html), [Node.js Docker](https://cheatsheetseries.owasp.org/cheatsheets/NodeJS_Docker_Cheat_Sheet.html) (container)
- [x] [Kubernetes Security](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) (container: delen om arbeidslaster og Pods. Klyngeadministrasjon holdes utenfor omfanget)
- [x] [Serverless / FaaS Security](https://cheatsheetseries.owasp.org/cheatsheets/Serverless_FaaS_Security_Cheat_Sheet.html) (serverless)

---

## 32. Forsyningskjede og CI/CD

- [x] [NPM Security](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html) (interpreter)
- [x] [Dependency Graph & SBOM Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html), [Vulnerable Dependency Management](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html) (interpreter)

---

## 33. Hemmeligheter og konfigurasjon

Håndtering av hemmeligheter er en driftsoppgave: hvelv, CI/CD, skykonfigurasjon, rotasjon. Den ene siden som gjelder koden (en hemmelighet hardkodet i kildekoden), dekkes av en deterministisk gjennomgang, ikke av en risikospesialisering. Flyttet til "Utenfor omfanget".

---

## 34. Prosess, design og styring

Personvern for brukere handler om retningslinjer og design (dataminimering, åpenhet, oppbevaring), ikke om en flate i koden som en spesialisering forsvarer. Flyttet til "Utenfor omfanget".

---

## 35. Betalinger og etterlevelse

- [x] [Secure Integration of Third-Party Payment Gateways](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Payment_Gateway_Integration_Cheat_Sheet.html) (payment)

---

## 36. Innebygde systemer, IoT og spesialiserte domener

Sikkerhet for kjøretøy og droner hører til domenet for innebygde systemer (CAN-buss, OTA-fastvare, integritet for sensorer og radio, fysisk tilgang), ikke til kildekoden for web- og API-applikasjoner som Lagune reviderer. Flyttet til "Utenfor omfanget".

---

## Utenfor omfanget (ingen flate i koden)

Dette er ikke områder for spesialiseringer og har ingen avkrysningsboks: Det dreier seg om styring, prosess, herding av driften eller bruk av rammeverk, uten en enkelt flate i koden som en spesialisering per flate kan forsvare. Sikkerhetsverdien er reell, men den ligger i prosess og arkitektur (eller, for et rammeverk, i den egne skillen for det språket), ikke i et forsvar denne katalogen leverer. De står her som referanse, ikke som arbeid som gjenstår.

- [Authorization Regression Testing](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Regression_Testing_Cheat_Sheet.html), [Authorization Testing Automation](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html)
- [JAAS](https://cheatsheetseries.owasp.org/cheatsheets/JAAS_Cheat_Sheet.html)
- [Denial of Service](https://owasp.org/www-community/attacks/Denial_of_Service), [Denial of Service](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [HTTP/2 Reset Attack](https://owasp.org/www-community/attacks/HTTP2_Reset_Attack)
- [Traffic flood](https://owasp.org/www-community/attacks/Traffic_flood)
- [Web Service Amplification Attack](https://owasp.org/www-community/attacks/web_service_amplificaiton) (forsterkning via SOAP/WS-Addressing, en driftsmessig DoS-variant uten flate i koden)
- [Cash Overflow](https://owasp.org/www-community/attacks/Cash_Overflow)
- [Spyware](https://owasp.org/www-community/attacks/Spyware), [Trojan Horse](https://owasp.org/www-community/attacks/Trojan_Horse) (skadevare hos sluttbrukeren, ikke en flate i koden til prosjektet som revideres. Leveransen i nettleseren hører til `browser`)
- [REST Security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html), [REST Assessment](https://cheatsheetseries.owasp.org/cheatsheets/REST_Assessment_Cheat_Sheet.html)
- [Web Service Security](https://cheatsheetseries.owasp.org/cheatsheets/Web_Service_Security_Cheat_Sheet.html)
- [Cloud Architecture Security](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Cloud_Architecture_Cheat_Sheet.html) (design og avveininger: IAM kontra signerte URL-er, offentlige og private VPC-er, tillitsgrenser, delt ansvar. I motsetning til `container` har den ingen konkret konfigurasjon som en spesialisering sjekker)
- [Infrastructure as Code Security](https://cheatsheetseries.owasp.org/cheatsheets/Infrastructure_as_Code_Security_Cheat_Sheet.html) (til tross for navnet handler det om SDLC-prosess og verktøy for å _forvalte_ IaC: IDE-plugins, statisk analyse, skanning av images, CI/CD, signering. Den viser ingen vei fra et usikkert mønster til en trygg form i en Terraform- eller CloudFormation-fil)
- [Kubernetes Security](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) (_bare delen om klyngeadministrasjon_: RBAC, etcd, API-server, admission. Delen om arbeidslaster og Pods er innenfor omfanget under `container`)
- [Network Segmentation](https://cheatsheetseries.owasp.org/cheatsheets/Network_Segmentation_Cheat_Sheet.html) (nettverksarkitektur og brannmurregler)
- [Subdomain Takeover Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Subdomain_Takeover_Prevention_Cheat_Sheet.html) (livssyklus og overvåking av DNS, ikke kode)
- [Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) (hvelv, CI/CD, rotasjon. Hardkodede hemmeligheter dekkes av en deterministisk gjennomgang, ikke av en risikospesialisering)
- [C-Based Toolchain Hardening](https://cheatsheetseries.owasp.org/cheatsheets/C-Based_Toolchain_Hardening_Cheat_Sheet.html) (flagg for kompilator, linker og bygging, uten sink i kildekoden)
- [Microservices Security](https://cheatsheetseries.owasp.org/cheatsheets/Microservices_Security_Cheat_Sheet.html), [Microservices based Security Arch Doc](https://cheatsheetseries.owasp.org/cheatsheets/Microservices_based_Security_Arch_Doc_Cheat_Sheet.html)
- [Zero Trust Architecture](https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html)
- [CI/CD Security](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html), [GitHub Actions Security](https://cheatsheetseries.owasp.org/cheatsheets/GitHub_Actions_Security_Cheat_Sheet.html)
- [Software Supply Chain Security](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html)
- [Error Handling](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html), [Full Path Disclosure](https://owasp.org/www-community/attacks/Full_Path_Disclosure) (global konfigurasjon av feilhåndtering per stakk. Lekkasjen er den samme avsløringen som feilhåndteringen allerede styrer)
- [Abuse of Functionality](https://owasp.org/www-community/attacks/Abuse_of_Functionality), [Business Logic Security](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html), [Abuse Case _(historisk)_](https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html) (applikasjonsspesifikt design, ingen enkelt sink i koden)
- [User Privacy Protection](https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html) (dataminimering, åpenhet, regler for oppbevaring)
- [Top 10 Automotive Security Vulnerabilities](https://cheatsheetseries.owasp.org/cheatsheets/Automotive_Security_Cheat_Sheet.html), [Drone Security](https://cheatsheetseries.owasp.org/cheatsheets/Drone_Security_Cheat_Sheet.html) (domener for innebygde systemer: CAN-buss, OTA-fastvare, integritet for sensorer og radio, ikke kildekode for web og API)
- [Mobile Application Security](https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html) (herding av plattformene Android og iOS: lagring, biometri, pinning, personopplysninger. Den har ingen enkelt flate i koden, og innlasting av ikke-klarert kode ble flyttet til `interpreter`)
- [Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html), [Threat Modeling _(fellesskapsside)_](https://owasp.org/www-community/Threat_Modeling)
- [Attack Surface Analysis](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html)
- [Secure Product Design](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html)
- [Secure Code Review](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html)
- [Virtual Patching](https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html)
- [Vulnerability Disclosure](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html)
- [Legacy Application Management](https://cheatsheetseries.owasp.org/cheatsheets/Legacy_Application_Management_Cheat_Sheet.html)
- [Security Terminology](https://cheatsheetseries.owasp.org/cheatsheets/Security_Terminology_Cheat_Sheet.html)
