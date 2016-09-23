const isnt = (target) => (test) => test !== target;

const MM = (objIn) => {
  const listeners = {};

  objIn[MM.on] = (eventName, cb) => {
    listeners[eventName] = [...(listeners[eventName] || []), cb];

    return () => {
      listeners[eventName] = listeners[eventName].filter(isnt(cb));
    };
  };
  objIn[MM.trigger] = (eventName, payload) => {
    (listeners[eventName] || []).map(listener => listener({
      type: eventName,
      details: payload
    }));
  };

  const handler = {
    get(target, prop) {
      const val = target[prop];
      objIn[MM.trigger](`get`, { key: prop,
                             value: val });
      return val;
    },

    set(target, prop, newVal) {
      const val = target[prop];
      const ret = target[prop] = newVal;
      objIn[MM.trigger](`set`, { key: prop,
                             prev: val,
                             value: newVal });
      return ret;
    },

    deleteProperty(target, prop) {
      objIn[MM.trigger](`delete`, { key: prop });
      return delete target[prop];
    },

    apply(targetFn, thisArg, args) {
      objIn[MM.trigger](`call`, { args,
                                context: thisArg });
      return targetFn.apply(thisArg, args);
    },

    construct(target, args) {
      objIn[MM.trigger](`construct`, { args });
      return new target(...args);
    }
  };

  return new Proxy(objIn, handler);
};

MM.on = Symbol(`on`);
MM.trigger = Symbol(`trigger`);

export default MM;
