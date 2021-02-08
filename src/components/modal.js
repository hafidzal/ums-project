import React from "react";

export const ModalComponent = ({handleClose, children}) => {
    
    return (
        <div>
            <section className="modal-main">
                {children}
            </section>
        </div>
    );
};
