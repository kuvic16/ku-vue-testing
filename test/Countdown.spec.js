import { mount } from "vue-test-utils";
import expect from "expect";
import Countdown from "../src/components/Countdown.vue";
import moment from "moment";
import sinon from "sinon";

describe("Countdown", () => {
  let wrapper, clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    wrapper = mount(Countdown, () => {});
  });

  afterEach(() => clock.restore());

  it("renders a countdown timer", () => {
    // <Countdown until="May 5 2020">
    wrapper.setProps({ until: moment().add(10, "seconds") });

    see("0 Days");
    see("0 Hours");
    see("0 Minutes");
    see("10 Seconds");
  });

  it("reduces the countdown every second", (done) => {
    wrapper.setProps({ until: moment().add(10, "seconds") });

    see("10 Seconds");
    clock.tick(1000);
    wrapper.vm.$nextTick(() => {
      try {
        see("9 Seconds");
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it("shows an expired message when the countdown has expired", (done) => {
    wrapper.setProps({ until: moment().add(10, "seconds") });
    clock.tick(10000);
    wrapper.vm.$nextTick(() => {
      try {
        see("Now Expired");
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it("shows a custom expired message when the countdown has completed", (done) => {
    wrapper.setProps({
      until: moment().add(10, "seconds"),
      expiredText: "Contest is over.",
    });
    clock.tick(10000);
    wrapper.vm.$nextTick(() => {
      try {
        see("Contest is over.");
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  // <Countdown @finished="method">
  if (
    ("broadcasts when the countdown is finished",
    (done) => {
      wrapper.setProps({ until: moment().add(10, "seconds") });
      clock.tick(10000);
      wrapper.vm.$nextTick(() => {
        try {
          expect(wrapper.emitted().finished).toBeTruthy();
          done();
        } catch (e) {
          done(e);
        }
      });
    })
  );

  it("clears the internal once completed", (done) => {
    wrapper.setProps({ until: moment().add(10, "seconds") });
    clock.tick(10000);
    expect(wrapper.vm.now.getSeconds()).toBe(10);
    wrapper.vm.$nextTick(() => {
      clock.tick(5000);
      try {
        expect(wrapper.vm.now.getSeconds()).toBe(10);
        done();
      } catch (e) {
        done(e);
      }
    });
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
});
