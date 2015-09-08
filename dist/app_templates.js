angular.module("outstanding.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("landing/landing.html","<div class=landing_page><div class=container><uploader storage=DataFactory.data class=margin_top_big></uploader><calendar source=DataFactory.parsedData selected=DataFactory.selectedDate is-utc=isUtc></calendar><date_details source=DataFactory.selectedDate></date_details></div></div>");
$templateCache.put("calendar/calendar.html","<section aria-label=Calendar class=calendar><div ng-repeat=\"(year, monthList) in CalendarFactory.years track by $index\" class=calendar_years><h3 ng-bind=year aria-label=Year></h3><div ng-repeat=\"(month, daysList) in monthList track by $index\" class=calendar_months><h4 ng-bind=getMonthName(month) aria-label=Month></h4><span class=calendar_days><button type=button ng-click=\"setSelectedDate(day, month, year)\" ng-repeat=\"(day, day_info) in daysList track by $index\" ng-class=\"{\'btn-primary\': !!day_info.events.length, \'btn-default\': !day_info.events}\" class=\"btn calendar_day_btn\"><div ng-hide=\"day_info.events.length > 0\" class=calendar_day><span ng-bind=day></span></div><div ng-show=\"day_info.events.length > 0\" class=extended_calendar_day><div ng-bind=day_info.events.length class=total_days_dues></div><div class=day_num_container><span ng-bind=day class=day_num></span></div><div ng-bind=\"getTotalForDay(day_info.events, DAY_EVENT_FIELDS.AMOUNT)\" class=total_days_amount></div></div></button></span></div></div></section>");
$templateCache.put("date_details/date_details.html","<section aria-label=\"Selected date details\" class=date_details><div class=selected_date></div><div class=dues_count></div><div class=total_amount></div><table class=table><tr><th>Contract</th><th>Amount</th><th>Time</th></tr><tr ng-repeat=\"c in contracts\"><td><span ng-bind=c.number></span><span ng-bind=c.amount></span><span ng-bind=c.time></span></td></tr></table></section>");
$templateCache.put("uploader/uploader.html","<section aria-label=Uploader class=uploader><input type=file file-reader=fileContent aria-label=\"Upload .csv file with a contracts data\" class=\"btn btn-success\"></section>");}]);