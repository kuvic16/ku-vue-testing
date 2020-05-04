import { mount } from "vue-test-utils";
import expect from "expect";
import Countdown from "../src/components/Countdown.vue";
import moment from "moment";
import sinon from "sinon";

describe("Countdown", () => {
  let wrapper, clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    wrapper = mount(Countdown, {
      propsData: {
        until: moment().add(10, "seconds"),
      },
    });
  });

  afterEach(() => clock.restore());

  it("renders a countdown timer", () => {
    // <Countdown until="May 5 2020">
    see("0 Days");
    see("0 Hours");
    see("0 Minutes");
    see("10 Seconds");
  });

  it("reduces the countdown every second", (done) => {
    see("10 Seconds");
    clock.tick(1000);
    assertOnNextTick(() => {
      see("9 Seconds");
    }, done);
  });

  it("shows an expired message when the countdown has expired", (done) => {
    clock.tick(10000);
    assertOnNextTick(() => {
      see("Now Expired");
    }, done);
  });

  it("shows a custom expired message when the countdown has completed", (done) => {
    wrapper.setProps({
      expiredText: "Contest is over.",
    });
    clock.tick(10000);
    assertOnNextTick(() => {
      see("Contest is over.");
    }, done);
  });

  // <Countdown @finished="method">
  if (
    ("broadcasts when the countdown is finished",
    (done) => {
      clock.tick(10000);
      assertOnNextTick(() => {
        clock.tick(5000);
        expect(wrapper.emitted().finished).toBeTruthy();
      }, done);
    })
  );

  it("clears the internal once completed", (done) => {
    clock.tick(10000);
    expect(wrapper.vm.now.getSeconds()).toBe(10);
    assertOnNextTick(() => {
      expect(wrapper.vm.now.getSeconds()).toBe(10);
    }, done);
  });

  // helper function
  let see = (text, selector) => {
    let wrap = selector ? wrapper.find(selector) : wrapper;
    expect(wrap.html()).toContain(text);
  };

  let click = (selector) => {
    wrapper.find(selector).trigger("click");
  };

  let type = (text, selector) => {
    let node = wrapper.find(selector);

    node.element.value = text;
    node.trigger("input");
  };

  let assertOnNextTick = (callback, done) => {
    wrapper.vm.$nextTick(() => {
      try {
        callback();
        done();
      } catch (e) {
        done(e);
      }
    });
  };
});
