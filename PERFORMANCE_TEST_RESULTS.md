TODO: There are performance tests written with k6 that are used for (1) measuring the performance of loading the assignment page and (2) measuring the performance of submitting assignments. The test results are outlined in the PERFORMANCE_TEST_RESULTS.md that is included in the assignment template.


# Performance test results

Brief description of the used server: HTTP/1.1

duration: "10s",
vus: 10,
summaryTrendStats: ["med", "p(99)"]


Brief description of your computer: 
MacBook Pro 13-inch, 2017, 
Processer: 2,3 GHz Dual-Core Intel Core i5, Graphics: Intel Iris Plus Graphics 640 1536 MB, Memory: 8 GB 2133 MHz LPDDR3


### Retrieving assignment

http_reqs: 460
http_req_duration - median: 147.15ms
http_req_duration - 99th percentile: 1.26s


### Submitting assignment

http_reqs: 3675
http_req_duration - median: 16.88ms
http_req_duration - 99th percentile: 153.93ms
