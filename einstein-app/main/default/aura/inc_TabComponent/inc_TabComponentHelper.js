({
	getCategoryJson : function(component, event, helper) {
        var categoryJson ={
            "categories": [
                {
                    "name": "Agent Productivity",
                    "id": "fcr",
                    "icon": "/analytics/wave/web/proto/images/template/icons/change.png",
                    "description" : "This Category will help you to analyze key performance indicators such as:Service level aggrement Performance by Team and Agent, How did and agent spent their day?- #Calls, Talk time, # Refused calls, Transfer on and off platform, Compare Productivity Metrics across Teams.",
                    "apps": [
                        {
                            "id": "SLAPA",
                            "name": "SLA Performance Analysis",
                            "description": "How well are we serving our customers?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/service.png"
                        },
                        {
                            "id": "TA",
                            "name": "Timecard Analysis - Calls, Talk Time, Refused & Transfers",
                            "description": "How did the Agent spend their day?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/change.png"
                        },
                        {
                            "id": "Sentiment",
                            "name": "Sentiment",
                            "description": "How satisfied are our customers?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/service.png"
                        }
                    ]
                },
                {
                    "name": "First Call Resolution",
                    "id": "fcr",
                    "description" : "This Category will help you to analyze key performance indicators such as:  What is the impact of call quality on Lead/Opportunity conversion on first call? What percentage of cases are closed on first call? Is there any correlation between FCR and: AHT,Account Type,Case Type,Agent Team and Agent? What is performance bt Channel? Voice,VM,Chat,Email, SMS? Performance by SF Object Type Case, Externally Routed Case(inContact WI)",
                    "icon":"/analytics/wave/web/proto/images/template/icons/service.png",
                    "apps": [
                        {
                            "id": "CaseAnalysis",
                            "name": "Case Analysis",
                            "description": "How are performing closing cases quickly?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/service.png",
                            "link": "https://keshav-kishor-en-dev-ed.my.salesforce.com/analytics/wave/wave.apexp?tsid=02u3i000001BfIb#dashboard/0FK3i000000AEwhGAG"
                        },
                        {
                            "id": "Voice Quality Analysis",
                            "name": "Voice Quality Analysis",
                            "description": "What is the impact of call quality on case closure?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/quoting.png"
                        },
                        {
                            "id": "CSAT",
                            "name": "Customer Satisfaction (CSAT)",
                            "description": "Are customers satisfied with cases closed on the first call?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/learning.png"
                        }
                    ]
                },
                {
                    "name": "Customer Journey Analysis",
                    "id": "CJA",
                    "description": "This Category will help you to analyze key performance indicators such as: 1. How long a customer spent in a given state? 2. Did call quality impact the customer Exprience? 3. Was this customer served within SLA? 4. What channel are most effective for meeting SLA for this customer?",
                    "icon": "/analytics/wave/web/proto/images/template/icons/quoting.png",
                    "apps": [
                        {
                            "id": "ICOT",
                            "name": "Interaction Channel Over Time",
                            "description": "How did/does this customer interact with us?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/change.png"
                        },
                        {
                            "id": "LOC",
                            "name": "Life of Contact (Initial Contact thru Disposition)",
                            "description": "How long did the customer spend in each segment of the contact?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/service.png"
                        },
                        {
                            "id": "AI",
                            "name": "Agent Impact",
                            "description": "How do specific agents or teams impact customer journey?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/change.png"
                        }
                    ]
                },
                {
                    "name": "IVR and self service Effectiveness",
                    "id": "ISSE",
                    "description": "Analyze performance of call paths. Analyze abandoned calls versus successful Self Service events",
                    "icon":"/analytics/wave/web/proto/images/template/icons/field-service.png",
                    "apps": [
                        {
                            "id": "NBAEA",
                            "name": "Next Best Action Effectiveness Analysis",
                            "description": "I used Einstein NBA - How well did it work?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/service.png"
                        },
                        {
                            "id": "IPPA",
                            "name": "IVR Press Path Analysis",
                            "description": "What are customers doing and are we getting the results we expect?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/field-service.png"
                        },
                        {
                            "id": "SSACBA",
                            "name": "Self Service/Abandoned Call Behavior Analysis",
                            "description": "Are we getting the desired results from our Self Service Processes? ",
                            "icon": "/analytics/wave/web/proto/images/template/icons/change.png"
                        }
                    ]
                },
                {
                    "name": "Team Productivity",
                    "id": "GTP",
                    "description": "Analyze performance of defined metrics for competition between teams, agents or individual goals. Create real time scoreboards for display in Agent for Salesforce gamification window",
                    "icon":"/analytics/wave/web/proto/images/template/icons/learning.png",
                    "apps": [
                        {
                            "id": "GA",
                            "name": "Gamification Analysis",
                            "description": "Do we get better results with agent contests?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/learning.png"
                        },
                        {
                            "id": "PD",
                            "name": "Performance Delta",
                            "description": "Why do some teams perform better than others?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/change.png"
                        },
                        {
                            "id": "MTA",
                            "name": "My Trailhead Analysis (across all categories)",
                            "description": "What is the impact of training on our desired outcomes? (FCR, Sales Productivity, Agent Productivity)",
                            "icon": "/analytics/wave/web/proto/images/template/icons/change.png"
                        }
                    ]
                },
                {
                    "name": "Sales Productivity",
                    "id": "fcr",
                    "description": "Sales productivity is defined at the rate at which your salespeople hit their revenue targets. The less time it takes a salesperson to meet her quota, the higher her sales productivity. To see how productive your reps are, use these metrics: Percentage of time spent on selling activities",
                    "icon":"/analytics/wave/web/proto/images/template/icons/sales.png",
                    "apps": [
                        {
                            "id": "LCA",
                            "name": "Lead Conversion Analysis",
                            "description": "What can we do to increase our Lead conversion rate?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/sales.png"
                        },
                        {
                            "id": "OCA",
                            "name": "Opportunity Conversion Analysis",
                            "description": "What can we do to increase our Opportunity rate?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/change.png"
                        },
                        {
                            "id": "VPA",
                            "name": "Volume Profit Analysis",
                            "description": "What factors contribute to high margin sales?",
                            "icon": "/analytics/wave/web/proto/images/template/icons/change.png"
                        }
                    ]
                },
                {
                    "name": "Expert Mode",
                    "id": "EM",
                    "description": "Extend existing Einstein templates. Create custom Einstein Analytics App. Create custom Einstein Discovery Stories",
                    "icon":"/analytics/wave/web/proto/images/template/icons/sales.png",
                    "apps": [
                        {
                            "id": "Config",
                            "name": "Configuration",
                            "description": "",
                            "icon": "/analytics/wave/web/proto/images/template/icons/change.png"
                        },
                        {
                            "id": "AS",
                            "name": "Analytics Studio",
                            "description": "",
                            "icon": "/analytics/wave/web/proto/images/template/icons/service.png"
                        }
                    ]
                }
            ]
        }
        console.log("incApp  ", categoryJson);
    component.set("v.categoryList   ",categoryJson.categories);
	},
    hideAllChildCmp : function(component, event, helper) {
        $A.util.addClass(component.find("incDashboard"),'slds-hide');
        $A.util.addClass(component.find("backBttnDiv"),'slds-hide');
        $A.util.addClass(component.find("repScheduler"),'slds-hide');
        $A.util.addClass(component.find("SPDashboard"),'slds-hide');
    }
    
})