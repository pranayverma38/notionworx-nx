import Image from "next/image";

export default function SizeGuide({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-find_size"
      id="findSize"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-heading d-flex align-items-center justify-content-between">
            <h4 className="title-pop">Size Chart</h4>
            <span className="cs-pointer d-flex link" data-bs-dismiss="modal">
              <i className="icon-X2 fs-24" />
            </span>
          </div>
          <div className="modal-main">
            <div className="tf-rte">
              <div className="tf-table-res-df mb-20">
                <p className="h6 fw-medium mb-16 cl-text-main">Size Guide</p>
                <div className="overflow-auto">
                  <table className="tf-sizeguide-table">
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>US</th>
                        <th>Bust</th>
                        <th>Waist</th>
                        <th>Low Hip</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>XS</td>
                        <td>2</td>
                        <td>32</td>
                        <td>24 - 25</td>
                        <td>33 - 34</td>
                      </tr>
                      <tr>
                        <td>S</td>
                        <td>4</td>
                        <td>34 - 35</td>
                        <td>26 - 27</td>
                        <td>35 - 26</td>
                      </tr>
                      <tr>
                        <td>M</td>
                        <td>6</td>
                        <td>36 - 37</td>
                        <td>28 - 29</td>
                        <td>38 - 40</td>
                      </tr>
                      <tr>
                        <td>L</td>
                        <td>8</td>
                        <td>38 - 29</td>
                        <td>30 - 31</td>
                        <td>42 - 44</td>
                      </tr>
                      <tr>
                        <td>XL</td>
                        <td>10</td>
                        <td>40 - 41</td>
                        <td>32 - 33</td>
                        <td>45 - 47</td>
                      </tr>
                      <tr>
                        <td>XXL</td>
                        <td>12</td>
                        <td>42 - 43</td>
                        <td>34 - 35</td>
                        <td>48 - 50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="tf-page-size-chart-content">
                <div>
                  <p className="h6 fw-medium mb-16 cl-text-main">
                    Measuring Tips
                  </p>
                  <div className="title fw-medium">Bust</div>
                  <p className="mb-12">
                    Measure around the fullest part of your bust.
                  </p>
                  <div className="title fw-medium">Waist</div>
                  <p className="mb-12">
                    Measure around the narrowest part of your torso.
                  </p>
                  <div className="title fw-medium">Low Hip</div>
                  <p className="mb-12">
                    With your feet together measure around the fullest part of
                    your hips/rear.
                  </p>
                </div>
                <div>
                  <Image
                    loading="lazy"
                    width={270}
                    height={270}
                    src="/assets/images/section/size-chart.jpg"
                    alt="Image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
