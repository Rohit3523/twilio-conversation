let initialState = {
  token: null,
  identity: null,
  twilioClient: null
}

function reducers(state = initialState, action){
  if(action.type == "SET_IDENTITY"){
    return {
      ...state,
      token: action.data.jwt,
      identity: action.data.identity
    };
  }

  if(action.type == "SET_TWILIO_CLIENT"){
    return {
      ...state,
      twilioClient: action.data
    };
  }

  return state;
}


export default reducers;