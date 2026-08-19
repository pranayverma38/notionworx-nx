
import React from 'react';

function Map() {
  return (
    <>
      
        <div className="section-map flat-spacing-2 pb-0">
          <div className="container">
            <div className="wg-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7880.148272329334!2d151.20657421407668!3d-33.858885268389294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae682c546039%3A0x16da940d587922a1!2sCircular%20Quay!5e0!3m2!1sen!2s!4v1745205798630!5m2!1sen!2s"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
    </>
  );
}

export default Map;
