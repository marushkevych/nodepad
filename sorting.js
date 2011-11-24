var diff = 10;

var o1 = {
    points : 100,
    days: 10
};

var o2 = {
    points : 150,
    days: 16
};

var o3 = {
    points : 200,
    days: 21
};

var o4 = {
    points : 300,
    days: 50
};

var offers = [o1, o2, o3, o4];



sort(offers);


function sort(offers) {
    console.log('sorting:');
    console.log(offers);

    var sorted = [];
    var runAgain = false;
    var prev;
    for(var i in offers) {

        if(!prev){
            prev = offers[i];
            continue;
        }
        var curr = offers[i];


        if(shouldSwap(prev, curr)) {
            sorted.push(curr);
            runAgain = true;
        } else {
            sorted.push(prev);
            prev = curr;
        }


        // check if last loop
        if(i == (offers.length -1)) {
            sorted.push(prev);
        }
    }

    if(runAgain) {
        sorted = sort(sorted);
    }

    return sorted;
}

function shouldSwap(o1, o2) {
    if(o1.points > o2.points) return !shouldSwapReally(o2, o1);

    return shouldSwapReally(o1, o2);
}


function shouldSwapReally(lessPoints, morePoints) {
    if(morePoints.days > lessPoints.days + diff) {
        return true;
    }

    return false;
}


// check if reveresed order will work with merge algorithm
// if not, implement bubble with reverse order