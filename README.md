# @themost/csv
Most Web Framework CSV Handler

#### Install

    npm install @themost/csv

Note: If you want to install the previous version (0.1.x) of most-web-csv module use:

    npm install most-web-csv 

    
#### Usage

Use this handler by extending HttpDataController class:

    //# http-data-controller-extensions.js
    import {HttpDataController} from '@themost/web/controllers/data';
    
    Object.assign(HttpDataController.prototype, {
        /**
        * @this HttpDataController
        */
        csv:(data)=> {
            return new HttpCsvResult(data);
        }
    });

    //# server.js
    import './http-data-controller-extensions';
    ...
    ...    

Register default route for /[controller]/[action].csv requests in config/routes.json:

    ...
    { "url":"/:controller/:action.json", "mime":"application/json" },
    { "url":"/:controller/:action.xml" },
    { "url":"/:controller/:action.csv", "mime":"application/csv" },
    ...

and finally add csv content type in application content types (config/app.json#mimes)

    ...
    {
      "extension": ".ttf",
      "type": "application/octet-stream"
    },
    ...
    {
      "extension": ".csv",
      "type": "application/csv"
    }
    ...
