class FMCIdentPage {
    static ShowPage1(fmc) {
        fmc.clearDisplay();
        let model = SimVar.GetSimVarValue("ATC MODEL", "string", "FMC");
        if (!model) {
            model = "unkn.";
        }
        let date = fmc.getNavDataDateRange();
        fmc.setTemplate([
            ['RTE DATA     SV 7704'],
            ['PGM', '1612987-115'],
            [''],
            ['GMT', '', '23:48'],
            [''],
            [''],
            [''],
            [''],
            [''],
            [''],
            [''],
            [''],
            ['GMT', '', '?'],
    ]);
        fmc.onLeftInput[5] = () => { B747_8_FMC_InitRefIndexPage.ShowPage1(fmc); };
        fmc.onRightInput[5] = () => { FMCPosInitPage.ShowPage1(fmc); };
    }
}
//# sourceMappingURL=B747_8_FMC_IdentPage.js.map