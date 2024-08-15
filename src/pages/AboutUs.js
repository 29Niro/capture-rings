import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import About2 from "../assets/about-2.jpg";
import About from "../assets/about.jpg";
import customerService from "../assets/customer-service.png";
import srilanka from "../assets/srilanka.png";
import support from "../assets/support.png";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { db } from "../firebase/firebase-config";

const ourServices = [
  {
    title: "Photoshoots",
    image: About,
    description:
      "Capture Rings where your precious moments are immortalized through the lens of our skilled photographers.",
  },
  {
    title: "Drone Shots",
    image: About,
    description:
      "Our skilled photographers make every occasion special with their artistic and creative photography skills.",
  },
];

export const AboutUs = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const querySnapshot = await getDocs(collection(db, "teams"));
      const teamsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamsData);
    };

    fetchTeams();
  }, []);

  return (
    <>
      <Header />
      <section className="px-6 md:px-36">
        {/* about us */}
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-3xl md:text-7xl font-bold text-gray-500 font-domine">
              About Us
            </h1>
            <p className="text-lg md:text-start text-gray-700 mb-6 md:mr-20">
              Our studio is dedicated to creating stunning, captivating, and
              timeless images and videos that tell your unique story.
            </p>
            <Link
              to="/gallery"
              className="bg-primaryBtn text-white px-6 py-3 rounded-3xl text-lg mr-4"
            >
              Gallery
            </Link>
          </div>
          <div className="mt-8 py-6 md:mt-0 md:w-1/2 flex justify-center">
            <img
              src={About}
              alt="Wedding rings"
              className="rounded-3xl shadow-lg"
            />
          </div>
        </div>
      </section>
      {/* why choose us */}
      <section className="mt-20 px-6 md:px-36">
        <h1 className="text-3xl md:text-7xl font-bold text-gray-500 font-domine text-center">
          Why Choose Us
        </h1>
        <div className="container mx-auto my-12 flex flex-col md:flex-row items-center justify-around text-center md:text-left text-gray-800">
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <img src={srilanka} className="h-12 w-12 mb-4" alt="like" />
            <p>Experienced Team</p>
            <p>
              They bring creativity and expertise to every project they
              undertake.
            </p>
          </div>

          <div className="flex flex-col items-center mb-6 md:mb-0">
            <img src={customerService} className="h-12 w-12 mb-4" alt="like" />
            <p>Personalized Approach </p>
            <p>
              We tailor our services to match your specific needs and
              preferences.{" "}
            </p>
          </div>
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <img src={customerService} className="h-12 w-12 mb-4" alt="like" />
            <p>Timely Delivery </p>
            <p>We deliver the results without compromising on quality.</p>
          </div>
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <img src={support} className="h-12 w-12 mb-4" alt="like" />
            <p>State-of-the-Art </p>
            <p>We invest in the latest camera gear and drone technology.</p>
          </div>
        </div>
      </section>
      {/* our services */}
      <section className="mt-20 px-6 md:px-36">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-3xl md:text-7xl my-8 font-bold text-gray-500 font-domine">
              Our Services
            </h1>
            <p className="text-lg md:text-start text-gray-700 mb-6 md:mr-20">
              Welcome to Capture Rings, where we turn moments into everlasting
              memories! We are a premier studio offering two exceptional
              services that will capture the essence of your experiences like
              never before.
              <br />
              <br /> Whether you're looking to capture cherished memories with
              our photoshoots or seeking awe-inspiring aerial views with our
              drone shots, Capture Rings is here to make your moments
              unforgettable. Let us be a part of your journey, and together,
              we'll create visual masterpieces that you'll treasure for a
              lifetime.
            </p>
          </div>
          <div className="mt-8 py-6 md:mt-0 md:w-1/2 flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {ourServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-700">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* our teams */}
      <section className="mt-20 px-6 md:px-36">
        <div className="container mx-auto flex flex-col items-center justify-between">
          <div className="text-center">
            <h1 className="text-3xl md:text-7xl font-bold text-gray-500 font-domine my-8">
              Our Teams
            </h1>
            <p className="text-lg text-gray-700 mb-6 md:mr-20">
              Our team of photographers and videographers are dedicated to
              creating stunning, captivating, and timeless images and videos
              that tell your unique story. We are committed to delivering
              exceptional results that exceed your expectations and capture the
              essence of your special moments.
            </p>
          </div>
          <div className="mt-8 py-6 md:mt-0 flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-6">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="overflow-hidden bg-white rounded-lg shadow-lg"
                >
                  <img
                    src={About} // You might want to add an image field to your teams in Firebase
                    alt={team.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{team.name}</h3>
                    <ul>
                      {team.employees.map((employee, index) => (
                        <li key={index} className="text-gray-600">
                          {employee.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* visit our gallery */}
      <section>
        <div
          className="container mx-auto mt-36 px-6 md:px-36 flex flex-col md:flex-row items-center justify-between bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: `url(${About2})`,
            height: "auto",
          }}
        >
          <div className="container mx-auto my-40 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left md:w-2/3">
              <h1 className="text-3xl md:text-6xl font-bold text-white font-domine">
                A Title to Turn the Visitor Into a Lead
              </h1>
              <p className="text-lg md:text-start text-white my-6 md:mr-20 md:w-1/2">
                This is your chance to emphasize why the visitor should contact
                you right now.
              </p>
              <Link
                to="/gallery"
                className="bg-primaryBtn font-bold text-white px-12 py-3 rounded-3xl text-lg mr-4"
              >
                Visit Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};
