import { Orderi } from "./order/Orderi";

export const da = 24*60*60*1000;
export const AWEEKAGO = new Date(new Date().getTime()-(7*da));
export const BEGINNINGOFTIME = new Date (0);

export const ORDERS: Orderi[] =[
{orderId:501,createDate:AWEEKAGO,customerName:'Michael Brennan',csrApprovalDate:AWEEKAGO,orderStatus:'In Progress',items:
    [{itemId:1,description:'Laptop', price:17000,qty:1}
    ,{itemId:2,description:'surge protector', price:178,qty:1}
    ,{itemId:3,description:'Monitor', price:11000,qty:1}
    ,{itemId:4,description:'Desktop', price:27000,qty:1}
    ]
},
{orderId:502,createDate:new Date(AWEEKAGO.getTime()+da),customerName:'Thomas Amsler',csrApprovalDate:BEGINNINGOFTIME,orderStatus:'New',items:
    [{itemId:1,description:'Android', price:100,qty:1}
    ,{itemId:2,description:'power cord', price:188,qty:1}
    ,{itemId:3,description:'Mouse', price:93,qty:1}
    ,{itemId:4,description:'Keyboard', price:162,qty:1}
    ]
},
{orderId:503,createDate:new Date(AWEEKAGO.getTime()+(2*da)),customerName:'Oleg Kalugin',csrApprovalDate:BEGINNINGOFTIME,orderStatus:'New',items:
    [{itemId:1,description:'Android', price:104,qty:1}
    ,{itemId:2,description:'usb cord', price:192,qty:1}
    ,{itemId:3,description:'wifi extender', price:94,qty:1}
    ,{itemId:4,description:'router', price:166,qty:1}
    ]
},
{orderId:504,createDate:new Date(AWEEKAGO.getTime()+(3*da)),customerName:'Ryan Fleming',csrApprovalDate:BEGINNINGOFTIME,orderStatus:'New',items:
    [{itemId:1,description:'iPhone', price:19000,qty:1}
    ,{itemId:2,description:'HDMI cord', price:196,qty:1}
    ,{itemId:3,description:'Mouse', price:90,qty:1}
    ,{itemId:4,description:'Keyboard', price:162,qty:1}
    ]
},
{orderId:505,createDate:new Date(AWEEKAGO.getTime()+(4*da)),customerName:'Magendiran Ganesan',csrApprovalDate:BEGINNINGOFTIME,orderStatus:'New',items:
    [{itemId:1,description:'Monitor Stand', price:1120,qty:1}
    ,{itemId:2,description:'Web Cam', price:212,qty:1}
    ,{itemId:3,description:'Ext Microphone', price:79,qty:1}
    ,{itemId:4,description:'Ethernet Cable', price:16,qty:1}
    ]
}
];