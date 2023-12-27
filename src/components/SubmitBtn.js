import './SubmitBtn.css'
const SubmitBtn = ({processloading= false,
                    textbutton = null,
                    stylebutton = 'submit_btn'}) => {
    const classBtn = processloading !== false ? 'btn-loading  button ' + stylebutton
        : 'button  ' + stylebutton

    return (<div>
            <button className={classBtn} type="submit">
                <div className="btn-area"><span className="text">{ textbutton }</span></div>
            </button></div>
    );
};

export default SubmitBtn;
