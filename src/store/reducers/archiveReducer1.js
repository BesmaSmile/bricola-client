import { getArchivedServices } from 'src/api/archive';

const initialState = { archivedServices: [] }

function toggleArchive(state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'TOGGLE_ARCHIVE':
            const archivedServiceIndex = state.archivedServices.findIndex(service => service._id === action.value._id)
            if (archivedServiceIndex !== -1) {
                nextState = {
                    ...state,
                    archivedServices: state.archivedServices.filter((service, index) => index !== archivedServiceIndex)
                }
            } else {
                nextState = {
                    ...state,
                    archivedServices: [...state.archivedServices, action.value]
                }
            }
            return nextState || state
        case 'LOAD_ARCHIVE':
            return state
        default:
            getArchivedServices("0559028560").then(data=>{
                satate = {
                    archivedServices: data
                };

            })
            return state;
    }
}

export default toggleArchive
