export function createPopupHTMLHaltestelle(properties) {
    const stop_name = properties.stop_name;
    const stop_id = properties.stop_id;
    return `    
    <table>
            <tbody>
                <tr>

                    <th style="width: 64px; display: flex; justify-content: center;">
                        <img src="https://mobidata-bw.de/karten/img/popup/Piktogramm_Haltestelle.svg" alt="Logo von Piktogramm_Haltestelle"
                            class="image" style="visibility: visible; height: 50px;" onload="this.style.visibility='visible'" onerror="         
                if (this.src.endsWith('.svg')) {
                    this.onerror = function() {             
                    this.onerror = null;
                    this.src = 'https://mobidata-bw.de/karten/img/popup/Piktogramm_Haltestelle.jpg';
                    };
                    this.src = 'https://mobidata-bw.de/karten/img/popup/Piktogramm_Haltestelle.png';
                }         
                else if (this.src.endsWith('.png')) {
                    this.onerror = null;
                    this.src = 'https://mobidata-bw.de/karten/img/popup/Piktogramm_Haltestelle.jpg';
                }
                ">
                    </th>

                    <th class="title" style="text-align: left">${stop_name}</th>
                </tr>
            </tbody>
        </table><br>
        <table>
            <tbody>
                <tr>
                    <td class="att">Haltesteig-ID</td>
                    <td class="attContent">${stop_id}</td>
                </tr>

                <tr>
                </tr>
            </tbody>
        </table>
        <table>
            <tbody>
                <tr>
                    <td class="attContentLink"><a href="https://www.efa-bw.de/rtMonitor/XSLT_DM_REQUEST?itdLPxx_banner=mobidatabw.png&itdLPxx_branding=mobidatabw&locationServerActive=1&stateless=1&sRaLP=1&itdLPxx_generalInfo=false&mode=direct&type_dm=any&itdLPxx_stopname=false&itdLPxx_genICS=false&itdLPxx_stopICS=false&itdLPxx_depLineICS=false&itdLPxx_depStopICS=false&itdLPxx_hint=false&itdLPxx_useRealtime=true&name_dm=${stop_id}" target="_blank">➥ Abfahrtsmonitor</a><a></a></td>
                    <td class="attContentLink"><a href="https://www.efa-bw.de/rtMonitor/XSLT_DM_REQUEST?itdLPxx_banner=mobidatabw.png&itdLPxx_branding=mobidatabw&locationServerActive=1&stateless=1&sRaLP=1&itdLPxx_generalInfo=false&mode=direct&type_dm=any&itdLPxx_stopname=false&itdLPxx_genICS=false&itdLPxx_stopICS=false&itdLPxx_depLineICS=false&itdLPxx_depStopICS=false&itdLPxx_hint=false&itdLPxx_useRealtime=true&itdDateTimeDepArr=arr&name_dm=${stop_id}" target="_blank">➥ Ankunftsmonitor</a><a></a></td>
                </tr>
            </tbody>
        </table>
    `;
}