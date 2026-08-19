import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";

function OrderTracking() {
  return (
    <>
      <div className="flat-spacing pt-0">
        <div className="container">
          <div className="row">
            <div className="col-sm-10 col-lg-8 col-xl-6 mx-auto">
              <PreventDefaultForm className="form-tracking">
                <div className="form-content">
                  <fieldset>
                    <input type="email" placeholder="Emaill Addess*" required />
                  </fieldset>
                  <fieldset>
                    <input type="text" placeholder="Billing Email*" required />
                  </fieldset>
                </div>
                <button type="submit" className="tf-btn animate-btn w-100">
                  Track
                </button>
              </PreventDefaultForm>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderTracking;
