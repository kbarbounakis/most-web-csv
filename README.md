# most-web-csv
Most Web Framework CSV Handler

Use this handler by adding the following code in application extensions (use app/extensions/data-controller-extensions.js or create a new one if it does not exist):

    var HttpDataController = require('most-web').controllers.HttpDataController,
        HttpCsvResult = require('most-web-csv').HttpCsvResult;
      
      HttpDataController.prototype.csv = function(data) {
          return new HttpCsvResult(data);
      };

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
