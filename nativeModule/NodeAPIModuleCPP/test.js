let addon = require("./build/Release/addon.node");
console.log("hello", addon.hello());
console.log("add", addon.add(1, 2, 3, 4, 5, 6, 7, 8, 9));
// console.log("add", addon.add());
// console.log("test");
// console.log("add", addon.add("aabb", "ddcc"));
let param = {
  timeSpan: 6,
  callBack: (err, result) => {
    if (err) {
      console.log("callback an error: ", err);
    } else {
      console.log("callback array:" + result);
    }
  },
};
let result = addon.asyncMethod(param);
console.log("asyncMethod", result);
param.timeSpan = 4;
result = addon.asyncMethod(param);
console.log("asyncMethod", result);
