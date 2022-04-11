import React from 'react';
import { getHourDifference, isToday } from '../../utils/dateTimeHelper';
import './addedTag.scss';

function AddedTag(props: {
    id: string,
    dateListed: string
}) {
    const { id, dateListed } = props;

    const getAddedTagText = (dateListed: string): string => {
        const now = new Date();
        const listingDate = new Date(dateListed);
        const addedHoursAgo = getHourDifference(now, listingDate);
        const addedDaysAgo = Math.floor(addedHoursAgo / 24);

        if (addedHoursAgo < 1) return "ADDED JUST NOW";

        if (addedHoursAgo < 2) return "ADDED 1 HOUR AGO";

        if (isToday(listingDate)) return `ADDED ${addedHoursAgo} HOURS AGO`;

        if (addedDaysAgo < 2) return "ADDED YESTERDAY";

        if (addedDaysAgo < 8) return `ADDED ${addedDaysAgo} DAYS AGO`;

        return "";
    };

    const addedTagText = getAddedTagText(dateListed);
    const addedTag = addedTagText != ""
        ? <span className="added-date">{addedTagText}</span>
        : <></>

    return (
        <React.Fragment key={id}>
            {addedTag}
        </React.Fragment>
    );
}

export default AddedTag;