var arr = [1,2,3,4];

//forEach
arr.forEach(function(val){
    //console.log(val+1)

}) 

//map
const res = arr.map((val)=> {
    return val+=12;
})

//filter

const filteredres = arr.filter((val)=> {
    if(val>2) {
        return val;
    }
})

//find

let value = arr.find((val)=> {
    return val > 2
})


//object

const me = {
    name:"shareif",
    age:19 ,
    hostel : "tapovan"
}

me.age = 20;
console.log(me.name)


//asyncronous 