# Part0 Exercice 6

 We can notice that here there is no redirection by the server after it gets the POST method. It returns a 201 signal instead, which notifies the browser that the information has reached the server properly.

```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: 201 Created
    deactivate server
    
```
