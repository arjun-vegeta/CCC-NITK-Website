import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#08152a] text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
        {/* Quick Links Section - Appears First on Phones */}
        <div className="order-1 md:order-none text-center md:text-left">
          <h3 className="text-xl font-Montserrat font-semibold text-green-600">
            QUICK LINKS
          </h3>
          <div className="h-0.5 w-20 md:w-80 bg-green-600 my-3 mx-auto md:mx-0"></div>
          <ul className="flex flex-col font-Montserrat items-center md:items-start">
            <li className="my-1">
              <a
                href="https://www.nitk.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:underline hover:text-blue-500"
              >
                NITK Website
              </a>
            </li>
            <li className="my-1">
              <a
                href="https://iris.nitk.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:underline hover:text-blue-500"
              >
                IRIS Portal
              </a>
            </li>
            <li className="my-1">
              <a
                href="https://telephone.nitk.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:underline hover:text-blue-500"
              >
                Telephone Directory
              </a>
            </li>
            <li className="my-1">
              <a
                href="https://alumni.nitk.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:underline hover:text-blue-500"
              >
                Alumni Website
              </a>
            </li>
            <li className="my-1">
              <a
                href="https://cdc.nitk.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:underline hover:text-blue-500"
              >
                Career Development Center (CDC)
              </a>
            </li>
          </ul>
        </div>

        {/* NITK Surathkal Section */}
        <div className="order-2 md:order-none text-center md:text-left">
          <div className="flex flex-col items-center md:flex-row md:items-center">
            <img
              src="/logo.png"
              alt="NITK Logo"
              className="w-12 h-auto md:w-16 md:h-auto mr-0 md:mr-4"
            />
            <h3 className="text-xl md:text-2xl font-Montserrat font-semibold">
              NITK Surathkal
            </h3>
          </div>
          <div className="h-0.5 w-20 md:w-80 font-Montserrat bg-green-600 my-4 mx-auto md:mx-0"></div>
          <p>NH-66, Srinivasnagar, Surathkal</p>
          <p>Mangaluru, Karnataka - 575025</p>
          <p className="hidden md:block">
            <br></br>
          </p>
          <p>0824 2474000</p>
          <p>info@nitk.edu.in</p>
        </div>

        {/* CCC NITK Section */}
        <div className="order-3 md:order-none text-center md:text-left">
          <div className="flex flex-col items-center md:flex-row md:items-center">
            <img
              src="/logo.png"
              alt="CCC Logo"
              className="w-12 h-auto md:w-16 md:h-auto mr-0 md:mr-4"
            />
            <h2 className="text-xl md:text-2xl font-Montserrat font-semibold">
              CCC NITK
            </h2>
          </div>
          <div className="h-0.5 w-20 md:w-80 font-Montserrat bg-green-600 my-4 mx-auto md:mx-0"></div>
          <p>Dr. Mohit P Tahiliani</p>
          <p>Professor In-charge, CCC</p>
          <p className="hidden md:block">
            <br></br>
          </p>
          <p>+91-824-2473083</p>
          <p>pic.ccc@nitk.edu.in</p>
        </div>
      </div>

      {/* Social Media Links
      <div className="mt-8 border-t-2 border-green-600 pt-4">
        <div className="container mx-auto flex justify-center space-x-8">
          <a
            href="https://www.facebook.com/nitkarnatakaOfficial"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white hover:text-green-500"
            >
              <path d="M22 11C22 4.92486 17.0751 0 11 0C4.92486 0 0 4.92486 0 11C0 16.4903 4.02252 21.0412 9.28125 21.8664V14.1797H6.48828V11H9.28125V8.57656C9.28125 5.81969 10.9235 4.29687 13.4361 4.29687C14.6392 4.29687 15.8984 4.51172 15.8984 4.51172V7.21875H14.5114C13.145 7.21875 12.7188 8.06674 12.7188 8.9375V11H15.7695L15.2818 14.1797H12.7188V21.8664C17.9775 21.0412 22 16.4903 22 11Z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/nitk.surathkal/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="currentColor"
              className="text-white hover:text-green-500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.0064 1.98125C13.9472 1.98125 14.2955 1.99414 15.452 2.04571C16.5269 2.09299 17.1073 2.27349 17.4942 2.42391C18.0059 2.62161 18.3756 2.86228 18.7583 3.24477C19.1452 3.63157 19.3817 3.99687 19.5794 4.5083C19.7299 4.8951 19.9105 5.47959 19.9578 6.54972C20.0094 7.7101 20.0223 8.05821 20.0223 10.9936C20.0223 13.9332 20.0094 14.2813 19.9578 15.4374C19.9105 16.5118 19.7299 17.092 19.5794 17.4788C19.3817 17.9902 19.1409 18.3598 18.7583 18.7423C18.3713 19.1291 18.0059 19.3655 17.4942 19.5632C17.1073 19.7136 16.5226 19.8941 15.452 19.9414C14.2912 19.993 13.9429 20.0059 11.0064 20.0059C8.06566 20.0059 7.71741 19.993 6.56088 19.9414C5.48603 19.8941 4.90561 19.7136 4.51866 19.5632C4.00704 19.3655 3.63729 19.1248 3.25464 18.7423C2.8677 18.3555 2.63123 17.9902 2.43346 17.4788C2.28298 17.092 2.1024 16.5075 2.05511 15.4374C2.00352 14.277 1.99062 13.9289 1.99062 10.9936C1.99062 8.05392 2.00352 7.7058 2.05511 6.54972C2.1024 5.47529 2.28298 4.8951 2.43346 4.5083C2.63123 3.99687 2.872 3.62727 3.25464 3.24477C3.64159 2.85798 4.00704 2.62161 4.51866 2.42391C4.90561 2.27349 5.49033 2.09299 6.56088 2.04571C7.71741 1.99414 8.06566 1.98125 11.0064 1.98125ZM11.0064 0C8.01837 0 7.64432 0.0128931 6.47059 0.0644657C5.30115 0.116038 4.49717 0.305138 3.80066 0.575894C3.07407 0.859543 2.45925 1.23344 1.84874 1.84802C1.23393 2.45829 0.859879 3.07287 0.576119 3.79488C0.305257 4.49541 0.116084 5.29478 0.0644909 6.46376C0.0128982 7.64134 0 8.01524 0 11.0021C0 13.9891 0.0128982 14.363 0.0644909 15.5362C0.116084 16.7052 0.305257 17.5089 0.576119 18.2051C0.859879 18.9314 1.23393 19.546 1.84874 20.1563C2.45925 20.7666 3.07407 21.1448 3.79637 21.4241C4.49717 21.6949 5.29685 21.884 6.46629 21.9355C7.64002 21.9871 8.01407 22 11.0021 22C13.9902 22 14.3643 21.9871 15.538 21.9355C16.7074 21.884 17.5114 21.6949 18.2079 21.4241C18.9302 21.1448 19.545 20.7666 20.1556 20.1563C20.7661 19.546 21.1444 18.9314 21.4239 18.2094C21.6947 17.5089 21.8839 16.7095 21.9355 15.5405C21.9871 14.3673 22 13.9934 22 11.0064C22 8.01954 21.9871 7.64563 21.9355 6.47236C21.8839 5.30338 21.6947 4.49971 21.4239 3.80348C21.153 3.07287 20.779 2.45829 20.1642 1.84802C19.5536 1.23774 18.9388 0.859543 18.2165 0.580191C17.5157 0.309435 16.716 0.120336 15.5466 0.0687634C14.3686 0.0128931 13.9945 0 11.0064 0Z" />
              <path d="M11.0064 5.35065C7.88509 5.35065 5.35275 7.88201 5.35275 11.0021C5.35275 14.1223 7.88509 16.6536 11.0064 16.6536C14.1278 16.6536 16.6602 14.1223 16.6602 11.0021C16.6602 7.88201 14.1278 5.35065 11.0064 5.35065ZM11.0064 14.6681C8.98143 14.6681 7.33906 13.0264 7.33906 11.0021C7.33906 8.97793 8.98143 7.3362 11.0064 7.3362C13.0315 7.3362 14.6738 8.97793 14.6738 11.0021C14.6738 13.0264 13.0315 14.6681 11.0064 14.6681Z" />
              <path d="M18.2036 5.12719C18.2036 5.8578 17.6103 6.44659 16.8837 6.44659C16.1528 6.44659 15.5638 5.8535 15.5638 5.12719C15.5638 4.39657 16.1571 3.80779 16.8837 3.80779C17.6103 3.80779 18.2036 4.40087 18.2036 5.12719Z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/school/nitk-surathkal/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white hover:text-green-500"
            >
              <path d="M20.8938 0.479492H2.10639C1.67486 0.479492 1.261 0.650919 0.955854 0.95606C0.650713 1.2612 0.479286 1.67506 0.479286 2.1066V20.8941C0.479286 21.3256 0.650713 21.7395 0.955854 22.0446C1.261 22.3497 1.67486 22.5212 2.10639 22.5212H20.8938C21.3254 22.5212 21.7392 22.3497 22.0444 22.0446C22.3495 21.7395 22.521 21.3256 22.521 20.8941V2.1066C22.521 1.67506 22.3495 1.2612 22.0444 0.95606C21.7392 0.650919 21.3254 0.479492 20.8938 0.479492ZM7.04893 19.2562H3.73502V8.72981H7.04893V19.2562ZM5.38968 7.27108C5.01377 7.26896 4.64692 7.15554 4.33542 6.94513C4.02391 6.73472 3.78172 6.43674 3.6394 6.08881C3.49708 5.74088 3.46102 5.35859 3.53576 4.99019C3.6105 4.62178 3.7927 4.28377 4.05936 4.01882C4.32602 3.75386 4.6652 3.57384 5.03407 3.50146C5.40295 3.42908 5.785 3.4676 6.13201 3.61215C6.47902 3.7567 6.77543 4.0008 6.98384 4.31365C7.19225 4.6265 7.30332 4.99408 7.30302 5.36999C7.30656 5.62166 7.25941 5.87147 7.16435 6.10453C7.0693 6.33759 6.92829 6.54912 6.74975 6.72653C6.5712 6.90393 6.35876 7.04358 6.1251 7.13713C5.89143 7.23069 5.64132 7.27624 5.38968 7.27108ZM19.2637 19.2654H15.9513V13.5147C15.9513 11.8187 15.2304 11.2952 14.2997 11.2952C13.317 11.2952 12.3527 12.0361 12.3527 13.5575V19.2654H9.0388V8.73747H12.2257V10.1962H12.2685C12.5884 9.54872 13.7089 8.44205 15.4186 8.44205C17.2677 8.44205 19.2652 9.53954 19.2652 12.7539L19.2637 19.2654Z" />
            </svg>
          </a>
          <a
            href="https://x.com/surathkal_nitk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="currentColor"
              className="text-white hover:text-green-500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0.0536585 0L8.54848 12.1358L0 22H1.925L9.40701 13.3612L15.4537 22H22L13.029 9.18339L20.9838 0H19.0622L12.1704 7.9544L6.60335 0H0.0536585ZM2.88415 1.51205H5.89238L19.1729 20.4844H16.1646L2.88415 1.51205Z" />
            </svg>{" "}
          </a>
        </div>
      </div> */}
    </footer>
  );
};

export default Footer;