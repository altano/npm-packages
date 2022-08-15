// (function urlChange() {
//   // const dbg = () => { debugger };
//   // const oldLocation = window.location;
//   // window.location = new Proxy(Object.create(oldLocation), {
//   //   get: function(target, property, receiver) {
//   //     if(property === 'replace') {
//   //       return (...args) => {
//   //         debugger;
//   //         oldLocation.apply(this, ...args);
//   //       };
//   //     }
//   //     return window.location[property];
//   //   },
//   //   set: function(target, property, value, receiver) {
//   //     return window.location[property] = value;
//   //     return true;
//   //   },
//   // });
//   location.href = 'http://example.com';
//   location.replace('http://example.com'); // Nothing happens
//   location.host; // Still works
//   location.host = 'example.com'; // Still works
// })();

(function functionArityBreakpoint() {
  function stopOnWrongArguments(name) {
    console.log(`Hello, ${name}`);
  }

  stopOnWrongArguments("alan");
  stopOnWrongArguments();
});
(function argumentLengthBreakpoint() {
  function stopOn3Arguments(name, age, occupation = "shitty magician") {
    console.log(`Hello, ${name}`);
  }

  stopOn3Arguments();
  stopOn3Arguments("alan", 34);
  stopOn3Arguments("alan", 34, "sad magician");
});
(function perfMeasurement() {
  for (let i = 0; i < 100000; ++i) {
    window.getComputedStyle(document.body);
  }

  console.log("done");
});
(function breakEveryOtherCall() {
  for (let i = 0; i < 10; ++i) {
    console.log(i);
  }
});
(function monitorClassMethodCalls() {
  function doSomethingWithADog(dog) {
    dog.bark(2);
  }

  class Dog {
    bark(count) {
      console.log("woo" + "f".padEnd(count, "f"));
    }
  }

  const dog = new Dog();
  doSomethingWithADog(dog);
});
(function monitorInstanceMethodCalls() {
  function doSomethingWithADog(dog) {
    dog.bark(2);
  }

  class Dog {
    bark(count) {} //console.log('woo' + 'f'.padEnd(count, 'f')); }
  }

  const dog = new Dog();
  doSomethingWithADog(dog);

  setTimeout(() => {
    doSomethingWithADog(dog);
  }, 6000);
});
(function traceMismatchedCalls() {
  function showSpinner() {
    /* ... */
  }

  function hideSpinner() {
    /* ... */
  }

  showSpinner();

  hideSpinner();

  showSpinner(); // Bad line: has no matching hideSpinner() call.
});
(function logXHR() {
  function getAww(position) {
    const url = `https://www.reddit.com/r/aww.json?limit=1&after=${position}`;
    return fetch(url);
  }

  getAww(0).then((data) => console.log(data));
});
(function logFetches() {
  function getData(url) {
    return fetch(url);
    //return Promise.resolve({});
  }
  function getPerson(id) {
    const url = `/person/${id}`;
    return getData(url);
  }
  getPerson(4).then((data) => console.log(data));
});

// (function createGlobal() {
//   function isValid(i) {
//     return i < 5;
//   }

//   for (let i = 0; isValid(i); ++i) {
//     console.log(i);
//   }

//   window.applicationState = {
//     ...window.applicationState,
//     [`property${i}`]: {i},
//   };
// });
