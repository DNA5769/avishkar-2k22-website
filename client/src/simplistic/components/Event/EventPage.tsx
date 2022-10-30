import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import MainService from '../../services/MainService';
import CoordinatorInfo from '../Common/CoordinatorInfo';
import parse from 'html-react-parser';
import Cookies from 'js-cookie';
import UserService from '../../services/UserService';
const EventPage = () => {
  const UNEXPECTED_ERROR_MSG = 'Please try again later!';
  const [eventCoordies, setEventCoordies] = useState([]);
  const [participatingTeam, setParticipatingTeam] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('-1');
  const [teams, setTeams] = useState([]);
  const [userDetails, setUserDetails] = useState({
    id: '',
    name: '',
    email: '',
    username: '',
    role: 'USER',
    mobile: '',
    collegeName: '',
    score: '',
    // gender: '',
    resumeLink: '',
    isFeePaid: false
  });
  const location = useLocation();
  const event = location.state;
  useEffect(() => {
    fetchTeamInvites();
    fetchEventCoordies(event.id);
    fetchUserDetails();
    fetchParticipation(event.id);
  }, []);
  const fetchTeamInvites = () => {
    const token = Cookies.get('token');
    if (token === undefined) {
      return;
    }
    UserService.getTeamInvites(token)
      .then((data) => {
        if (data['success']) {
          setTeams(data['teams']);
        } else if (data['message'] === 'Invalid token!') {
          toast.error('Login again');
        } else toast.error(data['message']);
      })
      .catch(() => {
        toast.error(UNEXPECTED_ERROR_MSG);
      });
  };
  const fetchEventCoordies = (eventId: string) => {
    MainService.getEventCoordies(eventId)
      .then((data) => {
        if (data['success']) {
          setEventCoordies(data['eventCoordies']);
        } else toast.error(data['message']);
      })
      .catch(() => {
        toast.error(UNEXPECTED_ERROR_MSG);
      });
  };

  const fetchParticipation = (eventId: string) => {
    const token = Cookies.get('token');
    if (token === undefined) {
      return;
    }
    UserService.checkEventParticipation(token, eventId)
      .then((data) => {
        if (data['success']) {
          if (data['participatingTeam'].length !== 0)
            setParticipatingTeam(data['participatingTeam'][0]);
          else setParticipatingTeam(null);
        } else if (data['message'] === 'Invalid token!') {
          toast.error('Please login again');
        } else toast.error(data['message']);
      })
      .catch(() => {
        toast.error(UNEXPECTED_ERROR_MSG);
      });
  };

  const fetchUserDetails = () => {
    const token = Cookies.get('token');
    if (token === undefined) {
      return;
    }
    UserService.getUserDetails(token)
      .then((data) => {
        if (data['success']) {
          if (data['details']['resumeLink'] === null) data['details']['resumeLink'] = '';
          setUserDetails(data['details']);
        } else if (data['message'] === 'Invalid token!') {
          toast.error('Login again');
        }
      })
      .catch(() => {
        toast.error(UNEXPECTED_ERROR_MSG);
      });
  };

  const handleParticipate = (teamId: number, eventId: string) => {
    const token = Cookies.get('token');
    if (token === undefined) {
      return;
    }
    UserService.eventParticipate(token, teamId, eventId)
      .then((data) => {
        if (data['success']) {
          fetchParticipation(event['id']);
          toast.success('Registered for Event Successfully!');
        } else if (data['message'] === 'Invalid token!') {
          toast.error('login again');
        } else toast.error(data['message']);
      })
      .catch(() => {
        toast.error(UNEXPECTED_ERROR_MSG);
      });
  };

  const handleUnparticipate = (teamId: number, eventId: string) => {
    const token = Cookies.get('token');
    if (token === undefined) {
      return;
    }
    UserService.eventUnparticipate(token, teamId, eventId)
      .then((data) => {
        if (data['success']) {
          fetchParticipation(event['id']);
          toast.success('Unregistered for Event Successfully!');
        } else if (data['message'] === 'Invalid token!') {
          toast.error('Login again');
        } else toast.error(data['message']);
      })
      .catch(() => {
        toast.error(UNEXPECTED_ERROR_MSG);
      });
  };
  const registerTeam = () => {
    handleParticipate(parseInt(selectedEvent), event['id']);
  };

  const unRegisterTeam = () => {
    if (participatingTeam) handleUnparticipate(participatingTeam['id'], event['id']);
  };
  return (
    <div className="w-full min-h-screen p-4 text-white bg-gray-900">
      <h2 className="text-4xl font-semibold tracking-widest uppercase md:text-5xl lg:text-6xl title">
        {event.name}
      </h2>
      <p className="my-4">{parse(event.tagline)}</p>
      {Cookies.get('token') ? (
        participatingTeam ? (
          <div>
            <h2 className="text-2xl tracking-wider uppercase transition-all duration-200 group-hover:underline stroke-text">
              {`Already registered with team ${participatingTeam['name']}`}
            </h2>
            <button
              type="button"
              className="inline-block w-full p-1 font-semibold text-center text-gray-900 uppercase bg-white border-2 md:w-max text-md"
              onClick={unRegisterTeam}>
              Unregister
            </button>
          </div>
        ) : (
          <div>
            {participatingTeam === null &&
              teams.filter(
                (team) =>
                  team['team']['leader'] === userDetails['id'] &&
                  event['minTeamSize'] <= team['team']['size'] &&
                  team['team']['size'] <= event['maxTeamSize']
              ).length === 0 && (
                <div>
                  <p className="px-4 text-sm text-center md:text-xl center 2xl:text-2xl">
                    To register for the event, either create a team, invite members (within team
                    size constraints) and register for the event or join a team and tell the leader
                    to register for the event
                  </p>
                </div>
              )}
            {participatingTeam === null &&
              teams.filter(
                (team) =>
                  team['team']['leader'] === userDetails['id'] &&
                  event['minTeamSize'] <= team['team']['size'] &&
                  team['team']['size'] <= event['maxTeamSize']
              ).length !== 0 && (
                <form className="flex flex-col items-stretch space-y-2 md:flex-row md:space-y-0">
                  {/* TODO:if team is registerd make diabled true */}
                  {/* TODO:make sure only those teams are listed jiska vo leader h */}
                  <select
                    id="team"
                    name="team"
                    className="flex-grow p-1 bg-transparent border"
                    disabled={false}
                    value={selectedEvent}
                    onChange={(e) => {
                      setSelectedEvent(e.target.value);
                    }}>
                    <option value="-1" className="px-1 py-2 text-white bg-gray-900">
                      select team
                    </option>
                    {teams
                      .filter((team) => team['team']['leader'] === userDetails['id'])
                      .map((team) => {
                        return (
                          <option
                            key={team['team']['id']}
                            value={team['teamId']}
                            className="px-1 py-2 text-white bg-gray-900">
                            {team['team']['name']}
                          </option>
                        );
                      })}
                  </select>
                  <button
                    type="button"
                    className="inline-block w-full p-1 font-semibold text-center text-gray-900 uppercase bg-white border-2 md:w-max text-md"
                    onClick={registerTeam}>
                    Register
                  </button>
                  {/* // TODO:add api to this button */}
                  {/* <button
          type="submit"
          className="inline-block w-full p-1 font-semibold text-center text-gray-900 uppercase bg-white border-2 md:w-max text-md">
          unregister
        </button> */}
                </form>
              )}
          </div>
        )
      ) : (
        ''
      )}

      {event.psLink && event.psLink !== '#' && (
        <div>
          <a
            href={event.psLink}
            className="inline-block w-full px-2 py-4 my-3 text-center uppercase border-2 md:w-max text-md group-hover:font-semibold hover:bg-white hover:text-gray-900">
            view ps
          </a>
        </div>
      )}
      {/* // TODO:button for admins to download the list */}
      {/* <button
          type="submit"
          className="inline-block w-full p-1 font-semibold text-center text-gray-900 uppercase bg-white border-2 md:w-max text-md">
          unregister
        </button> */}
      <hr className="mt-2 border-4 border-dotted" />
      {/* section  */}

      {/* section  */}
      <div className="px-2 py-4 mt-2 bg-gray-800 roundefirst-letter:d-sm hover:bg-gray-700 hover:shadow-md group">
        <h2 className="text-3xl tracking-wider uppercase transition-all duration-200 group-hover:underline stroke-text">
          about
        </h2>
        <p className="">{parse(event.details)}</p>
      </div>
      {/* section */}
      <div className="px-2 py-4 mt-2 bg-gray-800 roundefirst-letter:d-sm hover:bg-gray-700 hover:shadow-md group">
        <h2 className="text-3xl tracking-wider uppercase transition-all duration-200 group-hover:underline stroke-text">
          Rules
        </h2>
        <p className="">{parse(event.rules)}</p>
      </div>
      {/* section */}
      <div className="px-2 py-4 mt-2 bg-gray-800 roundefirst-letter:d-sm hover:bg-gray-700 hover:shadow-md group">
        <h2 className="text-3xl tracking-wider uppercase transition-all duration-200 group-hover:underline stroke-text">
          Criteria
        </h2>
        <p className="">{parse(event.criteria)}</p>
      </div>

      <div>
        <h2 className="text-3xl text-white md:text-4xl lg:text-5xl">Event coordinators</h2>
        <div className="flex flex-wrap items-stretch gap-3 py-4">
          {eventCoordies.map((c, i) => {
            return <CoordinatorInfo key={i} cord={c} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default EventPage;
