import React from 'react';
import './listingProgressBar.scss';

function ListingProgressBar(props: {
    id: string,
    dateListed: string,
    auctionScheduleTime?: string
}) {
    const { id, dateListed, auctionScheduleTime } = props;

    const msToDaysMultiplier = 1000 * 60 * 60 * 24;

    const dateListedDays = Math.round(new Date(dateListed).getTime() / msToDaysMultiplier);
    const auctionDateDays = auctionScheduleTime ? Math.round(new Date(auctionScheduleTime).getTime() / msToDaysMultiplier) : 0;
    const nowDays = Math.round(new Date().getTime() / msToDaysMultiplier);

    const min = 0;
    const max = 100;
    const progress = Math.round((auctionDateDays > 0 ? ((nowDays - dateListedDays) / (auctionDateDays - dateListedDays)) : 0) * 100);

    return (
        <React.Fragment key={id}>
            <div className="progress" style={{height: "2px"}}>
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{width: `${progress}%`}}
                        aria-valuenow={progress}
                        aria-valuemin={min}
                        aria-valuemax={max}
                    >
                    </div>
                </div>
        </React.Fragment>
    );
}

export default ListingProgressBar;