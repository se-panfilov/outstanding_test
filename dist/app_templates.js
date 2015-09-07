angular.module("outstanding.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("landing/landing.html","<div class=landing_page><div class=container><uploader storage=DataFactory.data></uploader><calendar source=DataFactory.data selected=DataFactory.selectedDate is-utc=isUtc></calendar><date_details source=DataFactory.selectedDate></date_details></div></div>");
$templateCache.put("calendar/calendar.html","<section aria-label=Calendar class=calendar><div ng-repeat=\"y in CalendarFactory.years track by $index\" class=years><h3 ng-bind=$index aria-label=Year></h3><div ng-repeat=\"m in y track by $index\" class=month><h4 ng-bind=$index aria-label=Month></h4></div><div ng-repeat=\"d in m track by $index\" class=month><span ng-bind=$index></span></div></div></section>");
$templateCache.put("date_details/date_details.html","<section aria-label=\"Selected date details\" class=date_details><div class=selected_date></div><div class=dues_count></div><div class=total_amount></div><table class=table><tr><th>Contract</th><th>Amount</th><th>Time</th></tr><tr ng-repeat=\"c in contracts\"><td><span ng-bind=c.number></span><span ng-bind=c.amount></span><span ng-bind=c.time></span></td></tr></table></section>");
$templateCache.put("uploader/uploader.html","<section aria-label=Uploader class=uploader><input type=file file-reader=fileContent aria-label=\"Upload .csv file with a contracts data\" class=\"btn btn-success\"><h4>Outstanding</h4></section>");}]);