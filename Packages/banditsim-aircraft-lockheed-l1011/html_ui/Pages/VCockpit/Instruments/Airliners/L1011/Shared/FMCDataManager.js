class FMCDataManager {
    constructor(_fmc) {
        this.fmc = _fmc;
    }
    IsValidLatLon(latLong) {
        if (latLong[0] === "N" || latLong[0] === "S") {
            if (isFinite(parseInt(latLong.substr(1, 2)))) {
                if (latLong[3] === "°") {
                    if (latLong[9] === "W" || latLong[9] === "E") {
                        if (isFinite(parseInt(latLong.substr(10, 3)))) {
                            if (latLong[13] === "°") {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
    async IsAirportValid(icao) {
        if (!icao || icao.length !== 4) {
            return false;
        }
        return new Promise((resolve) => {
            SimVar.SetSimVarValue("C:fs9gps:IcaoSearchStartCursor", "string", "A", "FMC").then(() => {
                SimVar.SetSimVarValue("C:fs9gps:IcaoSearchEnterChar", "string", icao, "FMC").then(() => {
                    resolve(SimVar.GetSimVarValue("C:fs9gps:IcaoSearchMatchedIcaosNumber", "number", "FMC") >= 1);
                });
            });
        });
    }
    async IsWaypointValid(ident) {
        if (!ident || ident.length < 0 || ident.length > 5) {
            return false;
        }
        return new Promise((resolve) => {
            SimVar.SetSimVarValue("C:fs9gps:IcaoSearchStartCursor", "string", "AVNWX", "FMC").then(() => {
                SimVar.SetSimVarValue("C:fs9gps:IcaoSearchEnterChar", "string", ident, "FMC").then(() => {
                    resolve(SimVar.GetSimVarValue("C:fs9gps:IcaoSearchMatchedIcaosNumber", "number", "FMC") > 0);
                });
            });
        });
    }
    async GetAirportByIdent(ident) {
        if (!(await this.IsAirportValid(ident))) {
            return undefined;
        }
        let icao = "A      " + ident.toLocaleUpperCase();
        let airportWaypoint = await this.fmc.facilityLoader.getAirport(icao);
        return airportWaypoint;
    }
    async GetWaypointsByIdent(ident) {
        let waypoints = [];
        let intersections = await this.GetWaypointsByIdentAndType(ident, "W");
        waypoints.push(...intersections);
        let vors = await this.GetWaypointsByIdentAndType(ident, "V");
        waypoints.push(...vors);
        let ndbs = await this.GetWaypointsByIdentAndType(ident, "N");
        waypoints.push(...ndbs);
        let airports = await this.GetWaypointsByIdentAndType(ident, "A");
        waypoints.push(...airports);
        let i = 0;
        while (i < waypoints.length) {
            let wp = waypoints[i];
            let j = i + 1;
            while (j < waypoints.length) {
                let other = waypoints[j];
                if (wp.icao === other.icao) {
                    waypoints.splice(j, 1);
                }
                else {
                    j++;
                }
            }
            i++;
        }
        return waypoints;
    }
    async GetWaypointsByIdentAndType(ident, wpType = "W") {
        return new Promise((resolve) => {
            let waypoints = [];
            SimVar.SetSimVarValue("C:fs9gps:IcaoSearchStartCursor", "string", wpType, "FMC").then(() => {
                SimVar.SetSimVarValue("C:fs9gps:IcaoSearchEnterChar", "string", ident, "FMC").then(async () => {
                    let waypointsCount = SimVar.GetSimVarValue("C:fs9gps:IcaoSearchMatchedIcaosNumber", "number", "FMC");
                    let getWaypoint = async (index) => {
                        return new Promise((resolve) => {
                            SimVar.SetSimVarValue("C:fs9gps:IcaoSearchMatchedIcao", "number", index, "FMC").then(async () => {
                                let icao = SimVar.GetSimVarValue("C:fs9gps:IcaoSearchCurrentIcao", "string", "FMC");
                                let waypoint = await this.fmc.facilityLoader.getFacility(icao);
                                resolve(waypoint);
                            });
                        });
                    };
                    for (let i = 0; i < waypointsCount; i++) {
                        let waypoint = await getWaypoint(i);
                        waypoints.push(waypoint);
                    }
                    resolve(waypoints);
                });
            });
        });
    }
}
//# sourceMappingURL=FMCDataManager.js.map