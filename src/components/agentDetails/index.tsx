import React from 'react';
import placeholder from '../../images/agent placeholder.png';

function AgentDetails(props: {
    id: string,
    name: string,
    photoUrl?: string,
}) {
    const { id, name, photoUrl } = props;

    return (
        <React.Fragment key={id}>
            {(name || photoUrl) &&
            <div className="w-50 d-inline-block text-center">
                <img loading="lazy" className="agent-photo" src={photoUrl ?? placeholder} alt="Agent profile" /><br />
                {name &&
                <span className="agent-name">{name}</span>
                }
            </div>
            }
        </React.Fragment>
    );
}

export default AgentDetails;