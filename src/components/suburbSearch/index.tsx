import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import React from 'react';
import './suburbSearch.scss';
import { Option } from '../../data/allSuburbOptions'
import { State } from '../../types/domain';

interface SuburbSearchProps {
    suburbs: string,
    updateSuburbs: (suburbs: string) => void;
    suburbOptions: Option[];
    state: State;
}

function SuburbSearch(props: SuburbSearchProps) {
    const { suburbs, updateSuburbs, state, suburbOptions } = props;
    const splitSuburbs = suburbs.split(',');
    return  <div className="suburb-search">
                <Typeahead
                    id="suburb-typeahead"
                    labelKey="name"
                    multiple
                    onChange={(x) => { updateSuburbs(x.map(x => { return x["name"]; }).join(',')) }}
                    options={suburbOptions}
                    placeholder="Start typing a suburb..."
                    minLength={2}
                    selected={splitSuburbs.filter(x => x !== "").map(x => { return { name: x.trim() } })}
                />
                {splitSuburbs.length > 3 &&
                    <div className="text-secondary scroll-message">Scroll the text box to add more suburbs</div>
                }
            </div>
}

export default SuburbSearch;