const { DialogV2 } = foundry.applications.api;

export class DiceDialog extends DialogV2 {
    constructor(options) {
        super(options);
    }
    static DEFAULT_OPTIONS = {
        classes: ['dee', 'sheet', 'dice'],
        actions: {
            stepUp: this.stepUp,
            stepDown: this.stepDown,
        },
    };

    static async stepUp(event, target) {
        event.preventDefault();
        return DiceDialog._updateDieElement(target, 1);
    }

    static async stepDown(event, target) {
        event.preventDefault();
        return DiceDialog._updateDieElement(target, -1);
    }
    /**
     * Handle updating the challenge die step
     * @param {HTMLElement} target  The clicked control ( step-up / step-down )
     * @param {Number} delta  The amount (positive or negative) to adjust the die step by
     * @private
     */
    static _updateDieElement(target, delta) {
        delta = parseInt(delta);
        const control = target.closest("a");
        const stepper = control.parentElement;
        const steps = stepper.querySelectorAll("[data-val]");
        let dieStep = parseInt(control.dataset.val);
        dieStep = (delta > 0) ? Math.min(dieStep + delta, 5) : Math.max(dieStep + delta, 0);
        const die = 2+ (2 * dieStep);
        const formula = `d${die}`;
        const icon = CONFIG.DEE.icons[formula];
        steps.forEach((step) => step.dataset.val = dieStep);
        const root = stepper.parentElement.parentElement;
        root.querySelector("input.formula").value = formula;
        root.querySelector("img").setAttribute("src",icon);
    }
}
