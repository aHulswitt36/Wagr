using MediatR;
using Microsoft.AspNetCore.Mvc;
using Wagr.Domain.Exceptions;
using System;
using Wagr.Domain.Models.DTO.Requests.Sleeper;
using Wagr.Domain.Models.Responses.Sleeper;

namespace Wagr.Api.Controllers
{
    public class SleeperController : Controller
    {
        private readonly IMediator _mediator;

        public SleeperController(IMediator mediator) 
        {
            _mediator = mediator;
        }
                
        [HttpGet("GetUserByUsername")]
        public async Task<ActionResult> Get(string username)
        {
            try
            {
                var command = new GetUserByUsernameQuery{ Username = username };
                var response = await _mediator.Send(command);
                if (response == null)
                    throw new UserNotFoundException("User was not found. Please try again");
                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("GetLeague")]
        public async Task<IActionResult> GetLeague(long leagueId)
        {
            try
            {
                var command = new GetLeagueByLeagueIdQuery{  LeagueId = leagueId };
                var response = await _mediator.Send(command);
                if (response == null)
                    throw new LeagueNotFoundException("League was not found. Please try again");
                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("GetUserLeagues")]
        public async Task<IActionResult> GetUserLeagues(string userId, int year)
        {
            try
            {
                var command = new GetUserLeaguesQuery { UserId = userId, Season = year };
                var response = await _mediator.Send(command);
                if (response == null)
                    throw new LeagueNotFoundException("User's leagues were not found. Please try again");
                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("GetLeagueMatchupsForWeek")]
        public async Task<IActionResult> GetLeagueMatchupsByWeek(long leagueId, int week)
        {
            try
            {
                var command = new GetLeagueMatchupsForWeekQuery { LeagueId = leagueId, Week = week };
                var response = await _mediator.Send(command);
                if (response == null)
                    throw new LeagueMatchupsNotFoundException("The provided League's matchups could not be found for the week");
                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("GetLeagueUsers")]
        public async Task<IActionResult> GetLeagueUsers(long leagueId)
        {
            try
            {
                var command = new GetLeagueUsersQuery { LeagueId =  leagueId };
                var response = await _mediator.Send(command);
                if (response == null)
                    throw new LeagueNotFoundException("League or its users were not found");
                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
