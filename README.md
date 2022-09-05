# bth-jsramverk-backend

Backend till en editor app. Här kan man med hjälp av api:et skapa, och uppdatera dokument som används i editor appen.

## För att starta 

Innan man startar

    npm install

För att starta

    npm start

## Routes strukturen
Få alla dokument

    (GET) /docs

Skapa nytt dokument. Skicka med 'title', och 'text'

    (POST) /docs

Upppdaterar dokumentet med {id}. Ändra 'title', eller 'text'

    (PUT) /docs/{id}