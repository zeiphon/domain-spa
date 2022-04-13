import React from 'react';
import { useState } from 'react';
import { Contact } from '../../types/domain';
import AgentDetails from '../agentDetails';
import './agencyDetails.scss';

function AgencyDetails(props: {
    id: string,
    name: string,
    logoUrl?: string,
    preferredColourHex: string,
    contacts?: Contact[]
}) {
    const { id, name, logoUrl, preferredColourHex, contacts } = props;

    const [open, setOpen] = useState(false);

    const agentBackgroundColour = preferredColourHex;
    const agentTextColour = calculateTextColourForBackgroundColour(hexToRgb(agentBackgroundColour));

    return (
        <React.Fragment key={id}>
            <div className={`agency-details px-3 ${open ? "open" : "closed"}`} style={{backgroundColor: agentBackgroundColour, color: agentTextColour}}>
                <span className="toggle me-2" onClick={() => setOpen(!open)}><i className={`icon-${open ? "up" : "down"}-open`} /></span>
                {!logoUrl &&
                <span className="agency-name">{name}</span>
                }
                {logoUrl &&
                <img className="agency-logo" src={logoUrl} />
                }
                {!open && contacts && contacts[0] && contacts[0].photoUrl &&
                <img className="agent-photo" style={{border: `3px solid ${agentBackgroundColour}`}} src={contacts[0].photoUrl} />
                }
                {open &&
                <React.Fragment>
                    {contacts &&
                        <div className="py-3">
                            {contacts[0] &&
                            <AgentDetails id={`${id}-agent-0`} name={contacts[0].name} photoUrl={contacts[0].photoUrl} />
                            }
                            {contacts[1] &&
                            <AgentDetails id={`${id}-agent-1`} name={contacts[1].name} photoUrl={contacts[1].photoUrl} />
                            }
                        </div>
                    }
                    <div className="info mb-2">
                        <span>{name}</span>
                    </div>
                </React.Fragment>
                }
            </div>
        </React.Fragment>
    );
}

function hexToRgb(hex: string): number[] {
    const withoutHash = hex.replaceAll('#', '');
    const parts = withoutHash.length === 3
        ? [ withoutHash[0], withoutHash[1], withoutHash[2] ]
        : [ withoutHash.substr(0, 2), withoutHash.substr(2, 2), withoutHash.substr(4, 2) ];
    return parts.map((x) => parseInt(`0x${x}`, 16));
}

// https://stackoverflow.com/a/3943023
function calculateTextColourForBackgroundColour(rgb: number[]): string {
    return (rgb[0]*0.299 + rgb[1]*0.587 + rgb[2]*0.114) > 186
        ? "#000000"
        : "#ffffff";
}

export default AgencyDetails;