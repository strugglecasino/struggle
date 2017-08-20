const Dispatcher = new (function() {
    // Map of actionName -> [Callback]
    this.callbacks = {};
  
    let self = this;
  
    this.registerCallback = function(actionName, cb) {
      console.log('[Dispatcher] registering callback for:', actionName);
  
      if (!self.callbacks[actionName]) {
        self.callbacks[actionName] = [cb];
      } else {
        self.callbacks[actionName].push(cb);
      }
    };
  
    this.sendAction = function(actionName, payload) {
      console.log('[Dispatcher] received action:', actionName, payload);
  
      // Ensure this action has 1+ registered callbacks
      if (!self.callbacks[actionName]) {
        throw new Error('Unsupported actionName: ' + actionName);
      }
  
      // Dispatch payload to each registered callback for this action
      self.callbacks[actionName].forEach(function(cb) {
        cb(payload);
      });
    };
  })();

  export default Dispatcher;