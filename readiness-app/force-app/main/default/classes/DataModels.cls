public with sharing class DataModels {
    //Response from inContact API
    public class ApiResponse {
        public String data { set; get; }
        public String statusText { set; get; }
        public Integer statusCode { set; get; }
        public String error { set; get; }
    }

    public class RunApexResponse {
        public String success;
        public String error;
    }
}