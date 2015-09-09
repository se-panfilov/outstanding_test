angular.module("outstanding.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("landing/landing.html","<div class=landing_page><div class=container><uploader storage=DataFactory.data class=margin_top_big></uploader><calendar source=DataFactory.parsedData selected=DataFactory.selectedDate is-utc=isUtc></calendar><date-details source=DataFactory.selectedDate></date-details></div></div>");
$templateCache.put("calendar/calendar.html","<section aria-label=Calendar class=calendar><div ng-repeat=\"(year, monthList) in CalendarFactory.years track by $index\" class=calendar_years><h3 ng-bind=year aria-label=Year></h3><div ng-repeat=\"(month, daysList) in monthList track by $index\" class=calendar_months><h4 ng-bind=CalendarFactory.getMonthName(month) aria-label=Month></h4><div class=days_of_week><span ng-repeat=\"d in DAYS_OF_WEEK\" ng-bind=d class=day_of_week></span></div><span class=\"calendar_days c_day_of_week_{{CalendarFactory.getDayOfWeek(month, year)}}\"><button type=button ng-click=\"setSelectedDate(day, month, year)\" ng-repeat=\"(day, day_info) in daysList track by $index\" ng-class=\"{\'btn-primary\': !!day_info.events.length, \'btn-default\': !day_info.events}\" class=\"btn calendar_day_btn\"><div ng-hide=\"day_info.events.length > 0\" class=calendar_day><span ng-bind=day></span></div><div ng-show=\"day_info.events.length > 0\" class=extended_calendar_day><div ng-bind=day_info.events.length class=total_days_dues></div><div class=day_num_container><span ng-bind=day class=day_num></span></div><div ng-bind=\"CalendarFactory.getTotalForDay(day_info.events, DAY_EVENT_FIELDS.AMOUNT)\" class=total_days_amount></div></div></button></span></div></div></section>");
$templateCache.put("date_details/date_details.html","<section aria-label=\"Selected date details\" class=date_details><h3 ng-bind=\"source.day + \' \' + CalendarFactory.getMonthName(source.month) + \' \' + source.year\" class=selected_date></h3><div ng-show=source.data.events class=normal_duties_body><h5 class=dues_count>Dues: &nbsp;<span ng-bind=source.data.events.length></span></h5><h5 class=total_amount>Total Amount: &nbsp;<span ng-bind=\"CalendarFactory.getTotalForDay(source.data.events, DAY_EVENT_FIELDS.AMOUNT)\"></span></h5><table ng-hide=!source.data.events class=\"table margin_top_big\"><tr><th>#</th><th>Contract</th><th>Amount</th><th>Time</th></tr><tr ng-repeat=\"e in source.data.events track by $index\"><td><span ng-bind=\"$index + 1\"></span></td><td><span ng-bind=e.contract></span></td><td><span ng-bind=e.amount></span></td><td><span ng-bind=\"e.time | pureTime\"></span></td></tr></table></div><div ng-show=\"source.data &amp;&amp; !source.data.events\" class=no_duties_body><h5>No dues today</h5></div></section>");
$templateCache.put("uploader/uploader.html","<section aria-label=Uploader class=uploader><input type=file file-reader=fileContent accept=csv aria-label=\"Upload .csv file with a contracts data\" class=\"btn btn-success\"></section>");}]);