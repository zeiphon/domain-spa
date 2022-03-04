import React from 'react';

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
                <img className="agent-photo" src={photoUrl} /><br />
                {name &&
                <span className="agent-name">{name}</span>
                }
            </div>
            }
        </React.Fragment>
    );
}

export default AgentDetails;