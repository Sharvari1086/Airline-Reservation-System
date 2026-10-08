import React from 'react';

const SeatMap = ({
  totalSeats,
  seatClass,
  selectedSeats = [],
  bookedSeats = [],
  onSeatClick,
  maxSelectable = 1
}) => {
  // Layout depends on seat class
  const layout = {
    economy: { seatsPerRow: 6, aisleAfter: 3, rows: Math.ceil(totalSeats / 6) },
    business: { seatsPerRow: 4, aisleAfter: 2, rows: Math.ceil(totalSeats / 4) },
    firstClass: { seatsPerRow: 4, aisleAfter: 2, rows: Math.ceil(totalSeats / 4) }
  };

  const config = layout[seatClass] || layout.economy;
  const { seatsPerRow, aisleAfter, rows } = config;

  const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, seatsPerRow);

  // Cabin crew seats - only the FIRST ROW is reserved
  const cabinCrewSeats = seatLetters.map((letter) => `1${letter}`);

  const isCrewSeat = (seatId) => cabinCrewSeats.includes(seatId);
  const isBookedFromDB = (seatId) => bookedSeats.includes(seatId);
  const isSelected = (seatId) => selectedSeats.includes(seatId);

  const handleClick = (seatId) => {
    if (isCrewSeat(seatId)) return;
    if (isBookedFromDB(seatId)) return;
    onSeatClick(seatId);
  };

  const getSeatClass = (seatId) => {
    if (isCrewSeat(seatId))
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    if (isBookedFromDB(seatId))
      return 'bg-red-200 text-red-700 cursor-not-allowed';
    if (isSelected(seatId)) return 'bg-primary-600 text-white shadow';
    return 'bg-green-100 text-green-800 hover:bg-green-200';
  };

  const getSeatTitle = (seatId) => {
    if (isCrewSeat(seatId)) return `${seatId} - Cabin Crew`;
    if (isBookedFromDB(seatId)) return `${seatId} - Booked`;
    if (isSelected(seatId)) return `${seatId} - Selected`;
    return `${seatId} - Available`;
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <div className="bg-gray-300 text-gray-700 px-10 py-2 rounded-t-3xl text-xs font-semibold tracking-wide">
          FRONT OF AIRCRAFT
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-xs mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary-600 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span>Cabin Crew</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 max-h-[500px] overflow-y-auto py-2">
        {/* Column Headers */}
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-6"></div>
          {seatLetters.map((letter, i) => (
            <React.Fragment key={letter}>
              <div className="w-8 text-center text-xs font-medium text-gray-500">
                {letter}
              </div>
              {i === aisleAfter - 1 && <div className="w-4"></div>}
            </React.Fragment>
          ))}
          <div className="w-6"></div>
        </div>

        {Array.from({ length: rows }).map((_, rowIndex) => {
          const rowNumber = rowIndex + 1;

          return (
            <div key={rowNumber} className="flex items-center gap-1.5">
              <div className="w-6 text-xs text-gray-500 text-right">
                {rowNumber}
              </div>

              {seatLetters.map((letter, letterIndex) => {
                const seatId = `${rowNumber}${letter}`;
                const seatIndex = rowIndex * seatsPerRow + letterIndex;

                if (seatIndex >= totalSeats) {
                  return (
                    <React.Fragment key={seatId}>
                      <div className="w-8"></div>
                      {letterIndex === aisleAfter - 1 && (
                        <div className="w-4"></div>
                      )}
                    </React.Fragment>
                  );
                }

                return (
                  <React.Fragment key={seatId}>
                    <button
                      type="button"
                      onClick={() => handleClick(seatId)}
                      disabled={isCrewSeat(seatId) || isBookedFromDB(seatId)}
                      className={`w-8 h-8 rounded-md text-xs font-medium transition ${getSeatClass(
                        seatId
                      )}`}
                      title={getSeatTitle(seatId)}
                    >
                      {letter}
                    </button>
                    {letterIndex === aisleAfter - 1 && (
                      <div className="w-4"></div>
                    )}
                  </React.Fragment>
                );
              })}

              <div className="w-6 text-xs text-gray-500">{rowNumber}</div>
            </div>
          );
        })}
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-600 mb-1">Selected Seats:</div>
          <div className="flex flex-wrap justify-center gap-2">
            {selectedSeats.map((seat) => (
              <span
                key={seat}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
              >
                {seat}
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {selectedSeats.length} of {maxSelectable} seat
            {maxSelectable !== 1 ? 's' : ''} selected
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;