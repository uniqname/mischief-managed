import test from 'tape';
import MM from './index';

test(`Mischief Managed`, (t) => {

  const o = { a:1, b:2 };
  const mm = MM(o);

  t.test(`get event`, (st) => {

    st.plan(4);

    const removeGet = mm[MM.on](`get`, (e) => {
      st.equal(e.type, `get`, `event type is 'get'`);
      st.equal(e.details.key, `a`, `event 'key' is the key being accessed`);
      st.equal(e.details.value, 1, `event 'value' is the current target value`);
    });

    st.equal(mm.a, 1, `property value remains unchanged`);
    removeGet();
  });


  t.test(`set event`, (st) => {

    st.plan(5);

    const removeSet = mm[MM.on](`set`, (e) => {
      st.equal(e.type, `set`, `event type is 'set'`);
      st.equal(e.details.key, `b`, `event 'key' is the key being whose value is being changed`);
      st.equal(e.details.prev, 2, `event 'prev' is the target value prior to changing`);
      st.equal(e.details.value, 3, `event 'value' is the target value after changing`);
    });

    mm.b = 3;
    st.equal(mm.b, 3, `property 'value' is the new updated value`);
    removeSet();
  });

  t.test(`set adding a property event`, (st) => {

    st.plan(5);

    const removeAdd = mm[MM.on](`set`, (e) => {
      st.equal(e.type, `set`, `event type is 'set'`);
      st.equal(e.details.key, `c`, `event 'key' is the new key being added`);
      st.equal(e.details.prev, undefined, `event 'prev' is undefined`);
      st.equal(e.details.value, `new`, `event 'value' is the value of the new key`);
    });

    mm.c = `new`;
    st.equal(mm.c, `new`, `property value is the new updated value`);
    removeAdd();

  });

  t.test(`delete event`, (st) => {

    st.plan(3);

    const removeDelete = mm[MM.on](`delete`, (e) => {
      st.equal(e.type, `delete`, `event type is 'delete'`);
      st.equal(e.details.key, `c`, `event 'prop' is the property being deleted`);
    });

    delete mm.c;
    st.notOk(`c` in mm, `deleted property no longer exists on object`);
    removeDelete();


  });

  t.test(`construct event`, (st) => {
    st.plan(2);

    function O(a, b) {
      this.a = a;
      this.b = b;
    };

    const MMO = MM(O);

    const removeConstruct = MMO[MM.on](`construct`, (e) => {
      st.deepEqual(e.details.args, [1, 2], `args should be the arguments passed to the constructor`);
    });

    st.deepEqual(new MMO(1, 2), { a:1, b:2 }, `object is constructed correctly`);
    removeConstruct();
  });
});
