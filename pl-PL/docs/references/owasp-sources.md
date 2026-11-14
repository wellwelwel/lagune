# Źródła OWASP

> Ta strona jest nieaktualna w porównaniu z wersją angielską. [Przeczytaj wersję oryginalną](https://lagune.ai/docs/references/owasp-sources).

> Skąd pochodzi wiedza wbudowanych specjalizacji OWASP, przyporządkowana do kanonicznych stron OWASP z opisami ataków i Cheat Sheets.

Adres kanoniczny: https://lagune.ai/pl-PL/docs/references/owasp-sources
Język: pl-PL
Oryginał: https://lagune.ai/docs/references/owasp-sources
Ostatnia aktualizacja: 2026-11-09

Ten dokument przyporządkowuje każdy **atak** (`www-community`) i każdy **Cheat Sheet** (`CheatSheetSeries`) OWASP do kategorii bezpieczeństwa, z linkiem do jego kanonicznej, publicznej strony. W obrębie kategorii równoważne pozycje dzielą jeden wiersz listy kontrolnej: ataki i Cheat Sheets dotyczące tego samego ryzyka stoją obok siebie, rozdzielone przecinkami. Pozycje bez bezpośredniego odpowiednika mają własny wiersz.

- Wszystkie zasługi należą do OWASP. Ataki znajdziesz pod adresem `https://owasp.org/www-community/attacks/<attack>`, a Cheat Sheets pod adresem `https://cheatsheetseries.owasp.org/cheatsheets/<cheat>.html`.

---

## 1. Ataki typu injection (ogólne)

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

## 2. Injection w SQL i bazach danych

- [x] [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection), [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html), [Query Parameterization](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html) (sql)
- [x] [Blind SQL Injection](https://owasp.org/www-community/attacks/Blind_SQL_Injection) (sql)
- [x] [SQL Injection Bypassing WAF](https://owasp.org/www-community/attacks/SQL_Injection_Bypassing_WAF) (sql)
- [x] [RSQL Injection](https://owasp.org/www-community/attacks/RSQL_Injection) (interpreter)
- [x] [Database Security](https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html) (sql)
- [x] [NoSQL Security](https://cheatsheetseries.owasp.org/cheatsheets/NoSQL_Security_Cheat_Sheet.html) (interpreter)

---

## 3. Command injection w systemie operacyjnym

- [x] [Command Injection](https://owasp.org/www-community/attacks/Command_Injection), [OS Command Injection Defense](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html) (interpreter)

---

## 4. Injection w LDAP, XPath i XML

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

## 6. Cross-Site Request Forgery (CSRF) i clickjacking

- [x] [Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/cross-site-request-forgery), [XSRF](https://owasp.org/www-community/attacks/XSRF), [Cross-Site Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) (http-request)
- [x] [Clickjacking](https://owasp.org/www-community/attacks/Clickjacking), [Clickjacking Defense](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html) (browser)
- [x] [Cross Site History Manipulation (XSHM)](https://owasp.org/www-community/attacks/Cross_Site_History_Manipulation_%28XSHM%29) (browser)
- [x] [Form action hijacking](https://owasp.org/www-community/attacks/Form_action_hijacking) (network)
- [x] [Reverse Tabnabbing](https://owasp.org/www-community/attacks/Reverse_Tabnabbing) (browser)

---

## 7. Przekierowania i przekazywanie żądań

- [x] [Open Redirect](https://owasp.org/www-community/attacks/open_redirect), [Unvalidated Redirects and Forwards](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) (network)
- [x] [Execution After Redirect (EAR)](https://owasp.org/www-community/attacks/Execution_After_Redirect_%28EAR%29) (browser)

---

## 8. Kontrola dostępu i autoryzacja

- [x] [Insecure Direct Object Reference (IDOR)](https://owasp.org/www-community/attacks/insecure_direct_object_reference), [Insecure Direct Object Reference Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) (access-control)
- [x] [Forced browsing](https://owasp.org/www-community/attacks/Forced_browsing) (access-control)
- [x] [Web Parameter Tampering](https://owasp.org/www-community/attacks/Web_Parameter_Tampering) (access-control)
- [x] [Setting Manipulation](https://owasp.org/www-community/attacks/Setting_Manipulation) (access-control)
- [x] [Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) (access-control)
- [x] [Transaction Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html) (access-control)
- [x] [Mass Assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html) (access-control)
- [x] [Multi-Tenant Application Security](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html) (access-control)

---

## 9. Uwierzytelnianie i dane uwierzytelniające

- [x] [Brute Force Attack](https://owasp.org/www-community/attacks/Brute_force_attack), [Password Spraying Attack](https://owasp.org/www-community/attacks/Password_Spraying_Attack), [Bot Management and Anti-Automation](https://cheatsheetseries.owasp.org/cheatsheets/Bot_Management_and_Anti-Automation_Cheat_Sheet.html) (credential-endpoint)
- [x] [Credential stuffing](https://owasp.org/www-community/attacks/Credential_stuffing), [Credential Stuffing Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html) (credential-endpoint)
- [x] [Qrljacking](https://owasp.org/www-community/attacks/Qrljacking) (federation)
- [x] [Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [Multifactor Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) (access-control)
- [x] [Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) (access-control)
- [x] [Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html), [Choosing and Using Security Questions](https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html) (access-control)
- [x] [Email Validation and Verification in Identity Systems](https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html) (access-control)

---

## 10. Zarządzanie sesją

- [x] [Session fixation](https://owasp.org/www-community/attacks/Session_fixation), [Session hijacking attack](https://owasp.org/www-community/attacks/Session_hijacking_attack), [Session Prediction](https://owasp.org/www-community/attacks/Session_Prediction), [Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) (access-control)
- [x] [Cookie Theft Mitigation](https://cheatsheetseries.owasp.org/cheatsheets/Cookie_Theft_Mitigation_Cheat_Sheet.html) (access-control)

---

## 11. Federacja tożsamości (OAuth, SAML i JWT)

- [x] [OAuth 2.0 Protocol](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html) (federation)
- [x] [SAML Security](https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html) (federation)
- [x] [JSON Web Token for Java](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) (federation)

---

## 12. Kryptografia i bezpieczeństwo transportu

- [x] [Cryptanalysis](https://owasp.org/www-community/attacks/Cryptanalysis), [Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html), [Key Management](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html) (crypto)
- [x] [Manipulator-in-the-Middle (MITM)](https://owasp.org/www-community/attacks/Man-in-the-middle_attack), [Transport Layer Security](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html) (transport)
- [x] [HTTP Strict Transport Security](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html) (transport)
- [x] [Pinning](https://cheatsheetseries.owasp.org/cheatsheets/Pinning_Cheat_Sheet.html) (transport)

---

## 13. Server-Side Request Forgery (SSRF)

- [x] [Server Side Request Forgery](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery), [Server-Side Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) (network)

---

## 14. Path traversal i obsługa plików

- [x] [Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal) (path)
- [x] [Binary Planting](https://owasp.org/www-community/attacks/Binary_planting) (path)
- [x] [Windows ::DATA Alternate Data Stream](https://owasp.org/www-community/attacks/Windows_DATA_alternate_data_stream) (path)
- [x] [Embedding Null Code](https://owasp.org/www-community/attacks/Embedding_Null_Code) (path)
- [x] [File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) (upload)

---

## 15. Nadużycia protokołu HTTP (nagłówki, cache, splitting)

- [x] [HTTP Response Splitting](https://owasp.org/www-community/attacks/HTTP_Response_Splitting), [Cross-User Defacement](https://owasp.org/www-community/attacks/Cross-User_Defacement) (interpreter)
- [x] [HTTP Security Response Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) (podzielone między browser, transport, http-request i access-control)
- [x] [Cache Poisoning](https://owasp.org/www-community/attacks/Cache_Poisoning) (interpreter)
- [x] [IP Spoofing via HTTP Headers](https://owasp.org/www-community/attacks/ip_spoofing_via_http_headers) (http-request)

---

## 16. Kodowanie i content spoofing

- [x] [Unicode Encoding](https://owasp.org/www-community/attacks/Unicode_Encoding) (interpreter)
- [x] [Double Encoding](https://owasp.org/www-community/Double_Encoding) (interpreter)
- [x] [Content Spoofing](https://owasp.org/www-community/attacks/Content_Spoofing) (browser)

---

## 17. Injection w plikach CSV i arkuszach kalkulacyjnych

- [x] [CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection) (csv)

---

## 18. CORS (Cross-Origin Resource Sharing)

- [x] [CORS OriginHeaderScrutiny](https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny) (http-request)
- [x] [CORS RequestPreflightScrutiny](https://owasp.org/www-community/attacks/CORS_RequestPreflightScrutiny) (http-request)

---

## 19. Odmowa usługi (DoS)

- [x] [Regular expression Denial of Service (ReDoS)](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) (regex)

---

## 20. Bezpieczeństwo pamięci i kod natywny

- [x] [Buffer Overflow Attack](https://owasp.org/www-community/attacks/Buffer_overflow_attack), [Buffer Overflow via Environment Variables](https://owasp.org/www-community/attacks/Buffer_Overflow_via_Environment_Variables) (c-cpp)
- [x] [Format string attack](https://owasp.org/www-community/attacks/Format_string_attack) (c-cpp)

---

## 21. Mobile code i wykonywanie niezaufanego kodu

- [x] [Mobile code invoking untrusted mobile code](https://owasp.org/www-community/attacks/Mobile_code_invoking_untrusted_mobile_code) (interpreter)
- [x] [Mobile code non-final public field](https://owasp.org/www-community/attacks/Mobile_code_non-final_public_field) (java)
- [x] [Mobile code object hijack](https://owasp.org/www-community/attacks/Mobile_code_object_hijack) (java)

---

## 22. Deserializacja

- [x] [Deserialization](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html) (podzielone między python, ruby, php, java i dotnet)

---

## 23. Złośliwe oprogramowanie i zagrożenia po stronie klienta

- [x] [Man-in-the-browser attack](https://owasp.org/www-community/attacks/Man-in-the-browser_attack), [Browser Extension Security Vulnerabilities](https://cheatsheetseries.owasp.org/cheatsheets/Browser_Extension_Vulnerabilities_Cheat_Sheet.html) (browser)
- [x] [Third Party JavaScript Management](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html) (browser)

---

## 24. Logi, wypieranie się działań i obsługa błędów

- [x] [Log Injection](https://owasp.org/www-community/attacks/Log_Injection), [Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), [Application Logging Vocabulary](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html) (interpreter)
- [x] [Repudiation Attack](https://owasp.org/www-community/attacks/Repudiation_Attack) (interpreter)

---

## 25. Logika biznesowa i nadużywanie funkcjonalności

Logika biznesowa i nadużywanie funkcjonalności nie mają jednej powierzchni ataku w kodzie, której mogłaby bronić specjalizacja poświęcona jednej powierzchni: obroną jest projekt dopasowany do konkretnej aplikacji, oparty na tym samym rozumowaniu, które prowadzi modelowanie zagrożeń w projekcie. Przeniesione do sekcji "Poza zakresem".

---

## 26. Bezpieczeństwo AI, LLM i agentów

- [x] [Prompt Injection](https://owasp.org/www-community/attacks/prompt-injection), [LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) (llm)
- [x] [MCP Tool Poisoning](https://owasp.org/www-community/attacks/MCP_Tool_Poisoning), [MCP (Model Context Protocol) Security](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html) (llm)
- [x] [HITL Dialog Forging (Lies-in-the-Loop)](https://owasp.org/www-community/attacks/lies-in-the-loop) (llm)
- [x] [AI Agent Security](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html), [Secure Coding with AI](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html) (llm)
- [x] [Retrieval-Augmented Generation (RAG) Security](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html) (llm)
- [x] [Secure AI/ML Model Ops](https://cheatsheetseries.owasp.org/cheatsheets/Secure_AI_Model_Ops_Cheat_Sheet.html) (llm)
- [x] [AML and Sanctions Compliance for AI Agent Payments](https://cheatsheetseries.owasp.org/cheatsheets/AML_Sanctions_AI_Agent_Payments_Cheat_Sheet.html) (llm)

---

## 27. Prototype pollution i cross-site leaks

- [x] [Prototype Pollution Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html) (javascript)
- [x] [Cross-site leaks (XS-Leaks)](https://cheatsheetseries.owasp.org/cheatsheets/XS_Leaks_Cheat_Sheet.html) (browser)

---

## 28. Frameworki i platformy językowe

- [x] [Django Security](https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html), [Django REST Framework](https://cheatsheetseries.owasp.org/cheatsheets/Django_REST_Framework_Cheat_Sheet.html) (python)
- [x] [Ruby on Rails](https://cheatsheetseries.owasp.org/cheatsheets/Ruby_on_Rails_Cheat_Sheet.html) (ruby)
- [x] [Laravel](https://cheatsheetseries.owasp.org/cheatsheets/Laravel_Cheat_Sheet.html) (php)
- [x] [Symfony](https://cheatsheetseries.owasp.org/cheatsheets/Symfony_Cheat_Sheet.html) (php)
- [x] [Java Security](https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html) (java)
- [x] [DotNet Security](https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html) (dotnet)
- [x] [NodeJS Security](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html) (javascript)
- [x] [PHP Configuration](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html) (php)

---

## 29. Frontend webowy i przeglądarka

- [x] [HTML5 Security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html) (browser)
- [x] [AJAX Security](https://cheatsheetseries.owasp.org/cheatsheets/AJAX_Security_Cheat_Sheet.html) (browser)
- [x] [Securing Cascading Style Sheets](https://cheatsheetseries.owasp.org/cheatsheets/Securing_Cascading_Style_Sheets_Cheat_Sheet.html) (podzielone między access-control i browser)

---

## 30. API i usługi

- [x] [GraphQL](https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html) (api-endpoint)
- [x] [gRPC Security](https://cheatsheetseries.owasp.org/cheatsheets/gRPC_Security_Cheat_Sheet.html) (api-endpoint)
- [x] [WebSocket Security](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html) (api-endpoint)

---

## 31. Chmura, kontenery i infrastruktura

Konfiguracja kontenerów i obciążeń to configuration as code, którą deweloper dostarcza razem z aplikacją (`Dockerfile`, Compose, `securityContext` poda), czyli realna powierzchnia ataku, na której `harden` wdraża poprawki, a `verify` wykazuje, że działają, dlatego należy do zakresu. Administracja klastrem (RBAC, etcd, serwer API, admission, segmentacja sieci) to domena operatora i pozostaje poza zakresem.

- [x] [Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html), [Node.js Docker](https://cheatsheetseries.owasp.org/cheatsheets/NodeJS_Docker_Cheat_Sheet.html) (container)
- [x] [Kubernetes Security](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) (container: część dotycząca obciążeń i podów. Administracja klastrem pozostaje poza zakresem)
- [x] [Serverless / FaaS Security](https://cheatsheetseries.owasp.org/cheatsheets/Serverless_FaaS_Security_Cheat_Sheet.html) (serverless)

---

## 32. Łańcuch dostaw i CI/CD

- [x] [NPM Security](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html) (interpreter)
- [x] [Dependency Graph & SBOM Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html), [Vulnerable Dependency Management](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html) (interpreter)

---

## 33. Sekrety i konfiguracja

Zarządzanie sekretami to kwestia operacyjna: sejfy na sekrety, CI/CD, konfiguracja chmury, rotacja. Jedyny aspekt na poziomie kodu (sekret zapisany na sztywno w kodzie źródłowym) wymaga deterministycznego skanowania, a nie specjalizacji poświęconej ryzyku. Przeniesione do sekcji "Poza zakresem".

---

## 34. Procesy, projektowanie i governance

Ochrona prywatności użytkowników to kwestia polityk i projektowania (minimalizacja danych, przejrzystość, retencja), a nie powierzchnia ataku w kodzie, której broni specjalizacja. Przeniesione do sekcji "Poza zakresem".

---

## 35. Płatności i zgodność z regulacjami

- [x] [Secure Integration of Third-Party Payment Gateways](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Payment_Gateway_Integration_Cheat_Sheet.html) (payment)

---

## 36. Systemy wbudowane, IoT i dziedziny specjalistyczne

Bezpieczeństwo pojazdów i dronów to domena systemów wbudowanych (magistrala CAN, firmware OTA, integralność czujników i łączności radiowej, dostęp fizyczny), a nie kod źródłowy aplikacji webowych i API, który audytuje Lagune. Przeniesione do sekcji "Poza zakresem".

---

## Poza zakresem (brak powierzchni ataku w kodzie)

Te pozycje nie są obszarem działania specjalizacji i nie mają pola wyboru: dotyczą governance, procesów, utwardzania operacyjnego albo korzystania z frameworków i nie mają jednej powierzchni ataku w kodzie, której mogłaby bronić specjalizacja poświęcona jednej powierzchni. Ich wartość dla bezpieczeństwa jest realna, ale leży w procesach i architekturze (albo, w przypadku frameworka, we własnym skillu danego języka), a nie w obronie, którą dostarcza ten katalog. Wymieniamy je jako punkt odniesienia, a nie jako zadania do wykonania.

- [Authorization Regression Testing](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Regression_Testing_Cheat_Sheet.html), [Authorization Testing Automation](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html)
- [JAAS](https://cheatsheetseries.owasp.org/cheatsheets/JAAS_Cheat_Sheet.html)
- [Denial of Service](https://owasp.org/www-community/attacks/Denial_of_Service), [Denial of Service](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [HTTP/2 Reset Attack](https://owasp.org/www-community/attacks/HTTP2_Reset_Attack)
- [Traffic flood](https://owasp.org/www-community/attacks/Traffic_flood)
- [Web Service Amplification Attack](https://owasp.org/www-community/attacks/web_service_amplificaiton) (amplifikacja przez SOAP/WS-Addressing, operacyjny wariant DoS bez powierzchni ataku w kodzie)
- [Cash Overflow](https://owasp.org/www-community/attacks/Cash_Overflow)
- [Spyware](https://owasp.org/www-community/attacks/Spyware), [Trojan Horse](https://owasp.org/www-community/attacks/Trojan_Horse) (złośliwe oprogramowanie na urządzeniach użytkowników końcowych, a nie powierzchnia ataku w kodzie audytowanego projektu. Aspekt dostarczania przez przeglądarkę należy do `browser`)
- [REST Security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html), [REST Assessment](https://cheatsheetseries.owasp.org/cheatsheets/REST_Assessment_Cheat_Sheet.html)
- [Web Service Security](https://cheatsheetseries.owasp.org/cheatsheets/Web_Service_Security_Cheat_Sheet.html)
- [Cloud Architecture Security](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Cloud_Architecture_Cheat_Sheet.html) (projektowanie i kompromisy: IAM a podpisane adresy URL, publiczne i prywatne VPC, granice zaufania, model współdzielonej odpowiedzialności. W odróżnieniu od `container` nie zawiera konkretnej konfiguracji, którą sprawdzałaby specjalizacja)
- [Infrastructure as Code Security](https://cheatsheetseries.owasp.org/cheatsheets/Infrastructure_as_Code_Security_Cheat_Sheet.html) (wbrew nazwie dotyczy procesów SDLC i narzędzi do _zarządzania_ IaC: wtyczek IDE, analizy statycznej, skanowania obrazów, CI/CD, podpisywania. Nie pokazuje w żadnym pliku Terraform ani CloudFormation drogi od niebezpiecznego wzorca do bezpiecznej postaci)
- [Kubernetes Security](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html) (_tylko część dotycząca administracji klastrem_: RBAC, etcd, serwer API, admission. Część dotycząca obciążeń i podów należy do zakresu w ramach `container`)
- [Network Segmentation](https://cheatsheetseries.owasp.org/cheatsheets/Network_Segmentation_Cheat_Sheet.html) (architektura sieci i polityka firewalla)
- [Subdomain Takeover Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Subdomain_Takeover_Prevention_Cheat_Sheet.html) (cykl życia i monitorowanie DNS, a nie kod)
- [Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) (sejfy na sekrety, CI/CD, rotacja. Aspekt sekretów zapisanych na sztywno w kodzie wymaga deterministycznego skanowania, a nie specjalizacji poświęconej ryzyku)
- [C-Based Toolchain Hardening](https://cheatsheetseries.owasp.org/cheatsheets/C-Based_Toolchain_Hardening_Cheat_Sheet.html) (flagi kompilatora, linkera i budowania, bez sinka w kodzie źródłowym)
- [Microservices Security](https://cheatsheetseries.owasp.org/cheatsheets/Microservices_Security_Cheat_Sheet.html), [Microservices based Security Arch Doc](https://cheatsheetseries.owasp.org/cheatsheets/Microservices_based_Security_Arch_Doc_Cheat_Sheet.html)
- [Zero Trust Architecture](https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html)
- [CI/CD Security](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html), [GitHub Actions Security](https://cheatsheetseries.owasp.org/cheatsheets/GitHub_Actions_Security_Cheat_Sheet.html)
- [Software Supply Chain Security](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html)
- [Error Handling](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html), [Full Path Disclosure](https://owasp.org/www-community/attacks/Full_Path_Disclosure) (globalna konfiguracja obsługi błędów w danym stosie. Wyciek to ta sama ekspozycja danych, którą już reguluje obsługa błędów)
- [Abuse of Functionality](https://owasp.org/www-community/attacks/Abuse_of_Functionality), [Business Logic Security](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html), [Abuse Case _(historyczny)_](https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html) (projekt dopasowany do konkretnej aplikacji, bez jednego sinka w kodzie)
- [User Privacy Protection](https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html) (minimalizacja danych, przejrzystość, polityka retencji)
- [Top 10 Automotive Security Vulnerabilities](https://cheatsheetseries.owasp.org/cheatsheets/Automotive_Security_Cheat_Sheet.html), [Drone Security](https://cheatsheetseries.owasp.org/cheatsheets/Drone_Security_Cheat_Sheet.html) (domeny systemów wbudowanych: magistrala CAN, firmware OTA, integralność czujników i łączności radiowej, a nie kod źródłowy aplikacji webowych i API)
- [Mobile Application Security](https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html) (utwardzanie platform Android i iOS: przechowywanie danych, biometria, pinning, dane osobowe. Nie ma jednej powierzchni ataku w kodzie, a aspekt ładowania niezaufanego kodu trafił do `interpreter`)
- [Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html), [Threat Modeling _(strona społeczności)_](https://owasp.org/www-community/Threat_Modeling)
- [Attack Surface Analysis](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html)
- [Secure Product Design](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html)
- [Secure Code Review](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html)
- [Virtual Patching](https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html)
- [Vulnerability Disclosure](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html)
- [Legacy Application Management](https://cheatsheetseries.owasp.org/cheatsheets/Legacy_Application_Management_Cheat_Sheet.html)
- [Security Terminology](https://cheatsheetseries.owasp.org/cheatsheets/Security_Terminology_Cheat_Sheet.html)
