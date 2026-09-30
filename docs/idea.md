Semplice PWA per la gestione dei turni all'interno di una azienda. In particolare per gestire:

- aggiunta, modifica e cancellazione di dipendenti
- gestione dei turni di tutti i dipendenti
- creazione di amministratori, fino a 3
- visualizzazione a calendario
- multiutente 
- multiazienda

Ogni utente ha un login diverso con codice azienda (unico) e codice personale (unico per utente).

Il tutto deve essere gestito SOLO da web app mobile.

Nextjs con prisma su database PostgreSQL, utilizzare Neon (https://neon.com/) per il db. 

Analizza quanto riportato pensa profondamente e fammi tutte le domande necessarie per realizzare la mia app.

Alcune domande e risposte: 
  * Una nuova azienda si iscrive con mail e password. Questo utente diventa il primo amministratore a cui è comunque è associato anche un codice personale.
  * Il codice azienda viene creato in automatico ed è un codice formato da 4 parole spaziate da un "-" (trattino). Scegli tu un insieme di parole  da poter utilizzare, devono essere della parole di utiizzo comune. Mutua la creazione dalla passphrase di bitcoin.
  * Il codice personale è una stringa alfanumerica di 8 caratteri tutto maiuscolo, non viene scelto ma viene associato in automatico quando si crea un nuovo utente
  * Quando un amministratore crea un nuovo utente manda in modo offline il codice utente
  * Ci sono 3 ruoli applicativi: amministratore di azienda, dipendente, superamministratore
    * amministratore di azienda: gestisce i suoi dipendenti
    * dipendente: è associata ad una e una sola azienda
    * superamministratore: utenza tecnica che vede tutte le aziend e i dipendenti
  * Utilizza .env.example per capire le variabili di ambiente
  * In un giorno un dipendente può avere anche più turni, non sovrapponibili
  * All'interno di una settimana per ogni dipendente deve poter essere configurato un numero di ore che deve lavorare
  * Non esiste una settimana tipo, di settimana in settimana un dipendente può fare turni completamente diversi
  * I turni vivono solo nella app, non c'è esportazione (Google Calendar o Apple Calendar) e importazione
  * Non c'è il concetto di notifica push
  * E' una app web mobile come PWA, quindi supportare qualsiasi smartphone
  * Un dipendente e un amministratore possono appartenere ad una sola azienda
  * Funziona solo con la connessione ad internet, non ci sono sincronizzazioni offline
  * Tema chiaro semplice, attento all'accessibilità e ai più recenti standard di sviluppo software per il mobile e il web
  * Verrà pubblicata su Vercel con database Neon
  * Utilizza questo repository per una brand identity corretta per la mia applicazione https://github.com/VoltAgent/awesome-design-md
