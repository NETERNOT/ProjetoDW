const CustomInput = React.memo(function CustomInput(props){
    const {label, type, value, onChange, errorMessage, isValid} = props;
    const [touched, setTouched] = React.useState(false)

    return(
        <div className={`inputContainer ${value.length>0  ? "filled" : ""} ${!isValid && touched ? "invalid" : ""}`}>
            <label htmlFor={type} >
              <span>{label}</span>
              <input
                type={type}
                value={value}
                onChange={(e)=>{
                    onChange(e);
                }}
                onBlur={(e)=>{
                    e.target.value.length===0? setTouched(false): setTouched(true)}}
                required
              ></input>
            </label>
            <p className="errorMessage">{errorMessage}</p>
          </div>
    );
});

