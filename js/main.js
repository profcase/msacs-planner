/**
 * MSACS Planner
 * To assist with planning an MS-ACS degree from NWMSU.
 * The program can be modified to assist with other degrees.
 *
 * @author Denise Case, Assistant Professor, NWMSU
 * @author
 * @author
 */
const msacsPlanner = (function () {

  "use strict"; // helps catch errors

  // HELPER FUNCTIONS USED BY EVENT LISTENERS ...............................

  /**
  * Used during processing of each course in the term.
  * @param {*} array
  * @param {*} callback
  * @param {*} scope
  */
  const forEach = function (array, callback, scope) {
    for (let i = 0; i < array.length; i++) {
      callback.call(scope, i, array[i]);
    }
  }

  /**
   * Calculate hours given a term nodeList
   * @param {} nodeList
   */
  const calcHours = function calcHours(nodeList) {
    let totHours = 0;
    forEach(nodeList, function (index, value) {
      const innerHtmlList = value.innerHTML.trim().split(" ");
      const numHours = parseInt(innerHtmlList[innerHtmlList.length - 1]);
      if (numHours) { totHours += numHours; }
    })
    return totHours;
  }

  /**
  * Used by term change event listeners to update the hour summary
  * @param {function} init
  * @param {object} planData
  */
  const updateTermHours = function (termNode) {
    const termID = termNode.id;
    console.log("Updating term hours for + " + termID);
    const coreHours = calcHours(termNode.querySelectorAll(".core"));
    const degreeHours = calcHours(termNode.querySelectorAll(".degree"));
    const totHours = coreHours + degreeHours;
    const hrString = totHours + " hrs (" + coreHours + "+" + degreeHours + ")";
    document.getElementById(termID + "-hours").innerHTML = "Hours: " + hrString;
  }

  /**
   * Used by button event listeners to update the plan
   * @param {function} init
   * @param {object} planData
   */
  const updatePlan = function (init, planData) {
    localStorage.setItem("plan", "");
    localStorage.setItem("plan", JSON.stringify(planData));
    init(termList);
    window.location.reload(true); // Reload current page without using cache
  }

  // CONFIGURE EVENT LISTENERS ......................................

  Array.from(document.getElementsByClassName("container"))
    .forEach(function (termNode) {
      termNode.addEventListener("onload", updateTermHours(termNode));
      termNode.addEventListener("change", updateTermHours(termNode));
    })

  document.getElementById("btnDefault").addEventListener("click", function () {
    const boolAnswer = confirm("Your changes will be lost. " +
      "Are you sure you want revert back to the default plan? ", "Warning");
    if (boolAnswer) { updatePlan(init, sched_99_default); }
  })

  document.getElementById("btnRestore").addEventListener("click", function () {
    const ans = window.prompt("What number do you want to retrieve?", "02");
    if (ans) {
      if (ans === "1" || ans === "01") { updatePlan(init, sched_01_fallstart); }
      else  if (ans === "2" || ans === "02") { updatePlan(init, sched_02_springstart); }
      else { alert("That schedule could not be found."); }
    }
  })

  document.getElementById("btnUnschedule").addEventListener("click",
    function () {
      const boolAnswer = confirm("Your changes will be lost. " +
        "Are you sure you want unschedule all courses in the plan?", "Warning");
      if (boolAnswer) { updatePlan(init, sched_00_unscheduled); }
    })

  // INITIALIZE THE PLAN.....................................................

  /**
   * Initialize the plan from local storage if available.
   * Made public by including in the return statement.
   */
  const init = function () {

    // Verify dependencies are avaiable

    if (!sched_00_unscheduled || sched_00_unscheduled.length === 0) {
      window.alert("The unscheduled requirements are not available. " +
        "Please contact the developer.");
    }
    if (!sched_99_default || sched_99_default.length === 0) {
      window.alert("The default degree schedule is not available. " +
        "Please contact the developer.");
    }
    if (!sched_01_fallstart || sched_01_fallstart.length === 0) {
      window.alert("Degree schedule 01 is not available. " +
        "Please contact the developer.");
    }
    if (!sched_02_springstart || sched_02_springstart.length === 0) {
      window.alert("Degree schedule 02 is not available. " +
        "Please contact the developer.");
    }
    if (!termList || termList.length === 0) {
      window.alert("The list of trimesters is not available. " +
        "Please contact the developer.");
    }

    // Log associated data

    console.log("Unscheduled: " + sched_00_unscheduled);
    console.log("Default: " + sched_99_default);
    console.log("01: " + sched_01_fallstart);
    console.log("02: " + sched_02_springstart);
    console.log("Term List : " + termList);

    // begin init

    let plan = [];

    window.dragula(termList)
      .on("drag", function (el, source) {
        el.className = el.className.replace("ex-moved", "");
      }).on("drop", function (el, target, source, sibling) {
        el.className += " ex-moved";
        setTimeout(function () {
          el.className = el.className.replace("ex-moved", "");
        }, 500);
        updateTermHours(target);
        updateTermHours(source);
      }).on("over", function (el, container, source) {
        container.className += " ex-over";
      }).on("out", function (el, container, source) {
        container.className = container.className.replace(" ex-over", "");
      })

    if (localStorage.getItem("plan")) {
      plan = JSON.parse(localStorage.getItem("plan"));
    }
    console.log(localStorage.getItem("plan"))
    const cssSelectorString = ".container";

    // querySelectorAll returns nodelist -> array for filter, map, foreach
    const nodesArray = Array.prototype.slice
      .call(document.querySelectorAll(cssSelectorString));
    console.log("nodesArray=" + nodesArray.length)

    const filtered = nodesArray.filter(function (e) {
      return plan.map(
        function (d) { return d["element"]; })
        .indexOf(e.id) === -1;
    }).forEach(function (e) {
      if (e && e.id && e.container && e.container.id) {
        plan.push({ "element": e.id, "container": e.container.id });
      }
    })

    plan.forEach(function (obj) {
      try{
      document.getElementById(obj.container)
        .appendChild(document.getElementById(obj.element));
      }
      catch(error){
        console.error(error.message);
      }
    })

    Array.from(document.getElementsByClassName("container"))
      .forEach(function (termNode) {
        updateTermHours(termNode)
      })
  }

  const dropped = function (el, target, source, sibling) {
    // Remove element from plan if it exists
    const indexEl = plan.map(function (d) {
      return d["element"];
    }).indexOf(el.id)
    if (indexEl > -1) { this.plan.splice(indexEl, 1) }
    const indexDrop = plan.length
    if (sibling) {
      indexDrop = plan.map(function (d) {
        return d["element"];
      }).indexOf(sibling.id);
    }
    plan.splice(indexDrop, 0, { "element": el.id, "container": target.id });
    localStorage.setItem("plan", JSON.stringify(plan));
  }

  const checkServiceWorker = function () {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./service-worker.js")
        .then(function (reg) {
          console.log("Service worker registered. Scope is " + reg.scope);
        }).catch(function (error) {
          console.log("Service worker registration failed with " + error);
        })
    }
  }

  // public API
  return {
    init: init
  }

})();

msacsPlanner.init();