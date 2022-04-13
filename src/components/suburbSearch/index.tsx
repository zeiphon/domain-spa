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

    return  <div className="suburb-search">
                <Typeahead
                    id="suburb-typeahead"
                    labelKey="name"
                    multiple
                    onChange={(x) => { updateSuburbs(x.map(x => { return x["name"]; }).join(','))}}
                    options={suburbOptions}
                    placeholder="Select some suburbs..."
                    minLength={2}
                    selected={suburbs.split(',').map(x => { return { name: x.trim() } })}
                />
            </div>
}

export default SuburbSearch;