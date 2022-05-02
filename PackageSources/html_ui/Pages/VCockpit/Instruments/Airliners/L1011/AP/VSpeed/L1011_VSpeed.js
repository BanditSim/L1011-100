class L1011_VSpeed extends Lockheed_FCU.VSpeed {
    get templateID() { return "L1011_VSpeed"; }
    shouldBeVisible() {
        return SimVar.GetSimVarValue("L:AP_VS_ACTIVE", "number") === 1;
    }
}
registerInstrument("l1011-vspeed-element", L1011_VSpeed);
//# sourceMappingURL=B747_8_VSpeed.js.map