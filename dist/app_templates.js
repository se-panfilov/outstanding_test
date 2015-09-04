angular.module("outstanding.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("landing/landing.html","<div class=landing_page><div class=container><uploader></uploader><calendar></calendar><date_details></date_details></div></div>");
$templateCache.put("calendar/calendar.html","<section aria-label=Calendar class=calendar><div class=calendar_nav><button type=button aria-label=\"Go prev month\" class=\"btn btn-default\"><i class=\"fa fa-back\"></i></button><button type=button aria-label=\"Go next month\" class=\"btn btn-default\"><i class=\"fa fa-forward\"></i></button></div><div class=calendar_dates></div></section>");
$templateCache.put("date_details/date_details.html","<section aria-label=\"Selected date details\" class=date_details><div class=selected_date></div><div class=dues_count></div><div class=total_amount></div><table class=table><tr><th>Contract</th><th>Amount</th><th>Time</th></tr><tr ng-repeat=\"c in contracts\"><td><span ng-bind=c.number></span><span ng-bind=c.amount></span><span ng-bind=c.time></span></td></tr></table></section>");
$templateCache.put("uploader/uploader.html","<section aria-label=Uploader class=uploader><input type=file file-reader=fileContent aria-label=\"Upload .csv file with a contracts data\" class=\"btn btn-success\"><h4>Outstanding</h4></section>");}]);